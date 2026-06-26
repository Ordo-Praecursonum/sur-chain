package keeper

import (
	"bytes"
	"context"

	"cosmossdk.io/collections"
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/surprotocol/surchain/x/attestation/types"
)

func (k msgServer) SubmitAttestation(goCtx context.Context, msg *types.MsgSubmitAttestation) (*types.MsgSubmitAttestationResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Self-sovereign origins (AI agents) identify themselves by their own key and
	// need no registered profile; everyone else must be a known identity.
	originForProfile := msg.Origin
	if originForProfile == "" {
		originForProfile = originHumanKeyboard
	}
	if !isSelfSovereignOrigin(originForProfile) {
		if !k.identityKeeper.HasUserProfile(ctx, msg.Username) {
			return nil, errorsmod.Wrapf(types.ErrUsernameNotFound, "username %q not found in identity module", msg.Username)
		}
	}

	// Validate content hash: must be 32 bytes
	if len(msg.ContentHash) != 32 {
		return nil, errorsmod.Wrapf(types.ErrInvalidContentHash, "content hash must be exactly 32 bytes")
	}

	// Validate nullifier: must be 32 bytes
	if len(msg.Nullifier) != 32 {
		return nil, errorsmod.Wrapf(types.ErrInvalidProof, "nullifier must be exactly 32 bytes")
	}

	// Check nullifier has not been used before (replay prevention). Done before
	// the expensive verification so replays are rejected cheaply.
	used, err := k.Nullifiers.Get(ctx, msg.Nullifier)
	if err == nil && used {
		return nil, errorsmod.Wrapf(types.ErrNullifierAlreadyUsed, "nullifier has already been used")
	}

	// Resolve the provenance class. Empty == human_keyboard (back-compat).
	origin := msg.Origin
	if origin == "" {
		origin = originHumanKeyboard
	}

	switch {
	case origin == originHumanKeyboard:
		// Human-typing attestation: bind the commitment root + verify the ZK proof.
		if len(msg.CommitmentRoot) != 32 {
			return nil, errorsmod.Wrapf(types.ErrInvalidProof, "commitment root must be exactly 32 bytes")
		}
		// Bind the proof's commitment root to the user's on-chain device commitment
		// root, so a prover cannot prove inclusion in a tree of their own choosing.
		storedRoot, ok := k.identityKeeper.GetCommitmentRoot(ctx, msg.Username)
		if !ok {
			return nil, errorsmod.Wrapf(types.ErrUsernameNotFound, "commitment root for %q not found", msg.Username)
		}
		if !bytes.Equal(storedRoot, msg.CommitmentRoot) {
			return nil, errorsmod.Wrapf(types.ErrInvalidCommitmentRoot,
				"commitment root does not match the registered root for %q", msg.Username)
		}
		// Verify the Groth16 proof against the embedded verifying key.
		if err := VerifyAttestationProof(msg.Username, msg.ContentHash, msg.Nullifier, msg.CommitmentRoot, msg.ProofBytes); err != nil {
			return nil, errorsmod.Wrapf(types.ErrInvalidProof, "ZK proof verification failed: %s", err)
		}

	case isDeclarationOrigin(origin):
		// Device-signed declaration: does NOT assert human typing. Verify the
		// device signature; no ZK proof or commitment root required.
		if err := verifyDeclaration(msg, origin); err != nil {
			return nil, errorsmod.Wrapf(types.ErrInvalidProof, "declaration verification failed: %s", err)
		}

	default:
		return nil, errorsmod.Wrapf(types.ErrInvalidProof, "unknown attestation origin %q", origin)
	}

	// Mark nullifier as used
	if err := k.Nullifiers.Set(ctx, msg.Nullifier, true); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to record nullifier")
	}

	// Store the attestation record
	record := types.AttestationRecord{
		Username:       msg.Username,
		ContentHash:    msg.ContentHash,
		Nullifier:      msg.Nullifier,
		CommitmentRoot: msg.CommitmentRoot,
		Timestamp:      ctx.BlockTime().Unix(),
		Origin:         origin,
		Citation:       msg.Citation,
	}
	if err := k.Attestations.Set(ctx, collections.Join(msg.Username, msg.Nullifier), record); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to store attestation record")
	}

	// Index by content hash so origin can be verified from the content itself.
	if err := k.ContentIndex.Set(ctx, collections.Join(msg.ContentHash, msg.Nullifier), record); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to index attestation by content")
	}

	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.EventTypeAttestationSubmitted,
		sdk.NewAttribute(types.AttributeKeyUsername, msg.Username),
	))

	return &types.MsgSubmitAttestationResponse{}, nil
}

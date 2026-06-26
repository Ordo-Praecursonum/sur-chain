package keeper

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/sha256"
	"fmt"
	"math/big"
	"regexp"

	"cosmossdk.io/collections"
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/surprotocol/surchain/x/identity/types"
)

// Identifiers are pseudonymous device ids (bech32 `surdev1…`, ~45 chars) by
// default, with optional shorter human handles — so the bound is 3..64 rather
// than 3..32. Charset stays lowercase-alphanumeric + - _ (bech32 is a subset).
var usernameRegex = regexp.MustCompile(`^[a-z0-9_-]{3,64}$`)

func (k msgServer) RegisterUsername(goCtx context.Context, msg *types.MsgRegisterUsername) (*types.MsgRegisterUsernameResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Validate username format
	if !usernameRegex.MatchString(msg.Username) {
		return nil, errorsmod.Wrapf(types.ErrInvalidUsername, "username %q must match ^[a-z0-9_-]{3,64}$", msg.Username)
	}

	// Check username not already taken
	if _, err := k.UserProfiles.Get(ctx, msg.Username); err == nil {
		return nil, errorsmod.Wrapf(types.ErrUsernameTaken, "username %q is already registered", msg.Username)
	}

	// Validate control pubkey: must be a 65-byte uncompressed P-256 point (0x04 || X || Y)
	if len(msg.ControlPubkey) != 65 || msg.ControlPubkey[0] != 0x04 {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey must be 65-byte uncompressed P-256 point")
	}
	x := new(big.Int).SetBytes(msg.ControlPubkey[1:33])
	y := new(big.Int).SetBytes(msg.ControlPubkey[33:65])
	if !elliptic.P256().IsOnCurve(x, y) {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey is not on P-256 curve")
	}

	// Validate first commitment: must be exactly 32 non-zero bytes
	if len(msg.FirstCommitment) != 32 {
		return nil, errorsmod.Wrapf(types.ErrInvalidCommitment, "first commitment must be exactly 32 bytes")
	}
	allZero := true
	for _, b := range msg.FirstCommitment {
		if b != 0 {
			allZero = false
			break
		}
	}
	if allZero {
		return nil, errorsmod.Wrapf(types.ErrInvalidCommitment, "first commitment must be non-zero")
	}

	// Verify ECDSA signature over the provided payload
	// The payload is the signed data constructed client-side; we verify the signature against it.
	pubKey := &ecdsa.PublicKey{
		Curve: elliptic.P256(),
		X:     x,
		Y:     y,
	}
	payloadHash := sha256.Sum256(msg.Payload)
	if !ecdsa.VerifyASN1(pubKey, payloadHash[:], msg.IdentitySig) {
		return nil, errorsmod.Wrapf(types.ErrInvalidSignature, "identity signature verification failed")
	}

	// Compute control key hash
	keyHash := sha256.Sum256(msg.ControlPubkey)

	// Create first DeviceCommitment at index 0
	device := types.DeviceCommitment{
		Username:   msg.Username,
		Index:      0,
		Commitment: msg.FirstCommitment,
		AddedAt:    ctx.BlockTime().Unix(),
		Revoked:    false,
		RevokedAt:  0,
	}
	if err := k.DeviceCommitments.Set(ctx, collections.Join(msg.Username, uint64(0)), device); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to store device commitment")
	}

	// Compute the depth-8 Poseidon commitment Merkle root over the device set,
	// matching the attestation circuit (NOT the raw first commitment).
	commitmentRoot, err := k.recomputeCommitmentRoot(ctx, msg.Username)
	if err != nil {
		return nil, errorsmod.Wrapf(err, "failed to compute commitment root")
	}

	// Create UserProfile
	profile := types.UserProfile{
		Username:        msg.Username,
		ControlKeyHash:  keyHash[:],
		RegisteredAt:    ctx.BlockTime().Unix(),
		CommitmentRoot:  commitmentRoot,
		DeviceCount:     1,
		TotalDeviceCount: 1,
	}
	if err := k.UserProfiles.Set(ctx, msg.Username, profile); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to store user profile")
	}

	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.EventTypeUsernameRegistered,
		sdk.NewAttribute(types.AttributeKeyUsername, msg.Username),
		sdk.NewAttribute(types.AttributeKeyControlKeyHash, fmt.Sprintf("%x", keyHash[:])),
	))

	return &types.MsgRegisterUsernameResponse{}, nil
}

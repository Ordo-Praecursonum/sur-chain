package keeper

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/sha256"
	"fmt"
	"math/big"

	"cosmossdk.io/collections"
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/surprotocol/surchain/x/provenance/types"
)

func (k msgServer) SubmitProvenanceNode(goCtx context.Context, msg *types.MsgSubmitProvenanceNode) (*types.MsgSubmitProvenanceNodeResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Fetch the principal
	principal, err := k.Principals.Get(ctx, msg.PrincipalId)
	if err != nil {
		return nil, errorsmod.Wrapf(types.ErrPrincipalNotFound, "principal %q not found", msg.PrincipalId)
	}

	// Validate content hashes: must be 32 bytes each
	if len(msg.ContentHashIn) != 32 {
		return nil, errorsmod.Wrapf(types.ErrInvalidSignature, "content_hash_in must be exactly 32 bytes")
	}
	if len(msg.ContentHashOut) != 32 {
		return nil, errorsmod.Wrapf(types.ErrInvalidSignature, "content_hash_out must be exactly 32 bytes")
	}

	// Verify the principal's signature over the node data
	// Signed payload: SHA-256(content_hash_in || content_hash_out || transformation_type || principal_id)
	h := sha256.New()
	h.Write(msg.ContentHashIn)
	h.Write(msg.ContentHashOut)
	h.Write([]byte(msg.TransformationType))
	h.Write([]byte(msg.PrincipalId))
	payloadHash := h.Sum(nil)

	pubkeyBytes := principal.Pubkey
	if len(pubkeyBytes) != 65 || pubkeyBytes[0] != 0x04 {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "stored principal pubkey is malformed")
	}
	x := new(big.Int).SetBytes(pubkeyBytes[1:33])
	y := new(big.Int).SetBytes(pubkeyBytes[33:65])
	pubKey := &ecdsa.PublicKey{Curve: elliptic.P256(), X: x, Y: y}
	if !ecdsa.VerifyASN1(pubKey, payloadHash, msg.Sig) {
		return nil, errorsmod.Wrapf(types.ErrInvalidSignature, "principal signature verification failed")
	}

	// Increment node counter to generate a unique ID
	counter, err := k.NodeCounter.Get(ctx)
	if err != nil {
		counter = 0
	}
	counter++
	if err := k.NodeCounter.Set(ctx, counter); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to update node counter")
	}

	nodeID := fmt.Sprintf("node-%d-%d", ctx.BlockHeight(), counter)

	node := types.ProvenanceNode{
		NodeId:             nodeID,
		ContentHashIn:      msg.ContentHashIn,
		ContentHashOut:     msg.ContentHashOut,
		TransformationType: msg.TransformationType,
		PrincipalId:        msg.PrincipalId,
		Timestamp:          ctx.BlockTime().Unix(),
	}
	if err := k.ProvenanceNodes.Set(ctx, nodeID, node); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to store provenance node")
	}
	// Graph indexes: content -> touching edges, one per direction, so lineage
	// queries are prefix scans instead of full-store walks.
	if err := k.NodesByIn.Set(ctx, collections.Join(msg.ContentHashIn, nodeID)); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to index provenance node by input")
	}
	if err := k.NodesByOut.Set(ctx, collections.Join(msg.ContentHashOut, nodeID)); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to index provenance node by output")
	}

	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.EventTypeProvenanceNodeSubmitted,
		sdk.NewAttribute(types.AttributeKeyNodeId, nodeID),
		sdk.NewAttribute(types.AttributeKeyPrincipalId, msg.PrincipalId),
	))

	return &types.MsgSubmitProvenanceNodeResponse{}, nil
}

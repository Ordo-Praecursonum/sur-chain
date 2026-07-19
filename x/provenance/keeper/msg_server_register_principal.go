package keeper

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"math/big"

	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/surprotocol/surchain/x/provenance/types"
)

func (k msgServer) RegisterPrincipal(goCtx context.Context, msg *types.MsgRegisterPrincipal) (*types.MsgRegisterPrincipalResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Check principal does not already exist
	if _, err := k.Principals.Get(ctx, msg.PrincipalId); err == nil {
		return nil, errorsmod.Wrapf(types.ErrPrincipalAlreadyExists, "principal %q is already registered", msg.PrincipalId)
	}

	// Validate principal ID is not empty
	if msg.PrincipalId == "" {
		return nil, errorsmod.Wrapf(types.ErrInvalidSignature, "principal_id cannot be empty")
	}

	// Validate the public key is a valid 65-byte uncompressed P-256 point
	if len(msg.Pubkey) != 65 || msg.Pubkey[0] != 0x04 {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "pubkey must be 65-byte uncompressed P-256 point")
	}
	x := new(big.Int).SetBytes(msg.Pubkey[1:33])
	y := new(big.Int).SetBytes(msg.Pubkey[33:65])
	if !elliptic.P256().IsOnCurve(x, y) {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "pubkey is not on P-256 curve")
	}
	_ = &ecdsa.PublicKey{Curve: elliptic.P256(), X: x, Y: y}

	principal := types.PipelinePrincipal{
		PrincipalId:   msg.PrincipalId,
		Name:          msg.Name,
		Pubkey:        msg.Pubkey,
		PrincipalType: msg.PrincipalType,
		RegisteredAt:  ctx.BlockTime().Unix(),
		Domain:        msg.Domain,
	}
	if err := k.Principals.Set(ctx, msg.PrincipalId, principal); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to store principal")
	}

	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.EventTypePrincipalRegistered,
		sdk.NewAttribute(types.AttributeKeyPrincipalId, msg.PrincipalId),
	))

	return &types.MsgRegisterPrincipalResponse{}, nil
}

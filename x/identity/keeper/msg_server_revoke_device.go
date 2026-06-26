package keeper

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/sha256"
	"math/big"

	"cosmossdk.io/collections"
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/surprotocol/surchain/x/identity/types"
)

func (k msgServer) RevokeDevice(goCtx context.Context, msg *types.MsgRevokeDevice) (*types.MsgRevokeDeviceResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Fetch existing user profile
	profile, err := k.UserProfiles.Get(ctx, msg.Username)
	if err != nil {
		return nil, errorsmod.Wrapf(types.ErrUsernameNotFound, "username %q not found", msg.Username)
	}

	// Validate pubkey and verify it matches the stored control key
	if len(msg.ControlPubkey) != 65 || msg.ControlPubkey[0] != 0x04 {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey must be 65-byte uncompressed P-256 point")
	}
	x := new(big.Int).SetBytes(msg.ControlPubkey[1:33])
	y := new(big.Int).SetBytes(msg.ControlPubkey[33:65])
	if !elliptic.P256().IsOnCurve(x, y) {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey is not on P-256 curve")
	}

	keyHash := sha256.Sum256(msg.ControlPubkey)
	storedHash := profile.ControlKeyHash
	for i := range keyHash {
		if keyHash[i] != storedHash[i] {
			return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey does not match registered key")
		}
	}

	pubKey := &ecdsa.PublicKey{Curve: elliptic.P256(), X: x, Y: y}
	payloadHash := sha256.Sum256(msg.Payload)
	if !ecdsa.VerifyASN1(pubKey, payloadHash[:], msg.IdentitySig) {
		return nil, errorsmod.Wrapf(types.ErrInvalidSignature, "identity signature verification failed")
	}

	// Fetch the device commitment
	device, err := k.DeviceCommitments.Get(ctx, collections.Join(msg.Username, msg.DeviceIndex))
	if err != nil {
		return nil, errorsmod.Wrapf(types.ErrDeviceNotFound, "device %d not found for user %q", msg.DeviceIndex, msg.Username)
	}

	if device.Revoked {
		return nil, errorsmod.Wrapf(types.ErrDeviceAlreadyRevoked, "device %d is already revoked", msg.DeviceIndex)
	}

	// Mark device as revoked
	device.Revoked = true
	device.RevokedAt = ctx.BlockTime().Unix()
	if err := k.DeviceCommitments.Set(ctx, collections.Join(msg.Username, msg.DeviceIndex), device); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to update device commitment")
	}

	// Recompute the commitment Merkle root with the revoked device removed.
	commitmentRoot, err := k.recomputeCommitmentRoot(ctx, msg.Username)
	if err != nil {
		return nil, errorsmod.Wrapf(err, "failed to compute commitment root")
	}
	profile.CommitmentRoot = commitmentRoot

	// Decrement active device count
	if profile.DeviceCount > 0 {
		profile.DeviceCount--
	}
	if err := k.UserProfiles.Set(ctx, msg.Username, profile); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to update user profile")
	}

	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.EventTypeDeviceRevoked,
		sdk.NewAttribute(types.AttributeKeyUsername, msg.Username),
	))

	return &types.MsgRevokeDeviceResponse{}, nil
}

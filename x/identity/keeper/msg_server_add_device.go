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

func (k msgServer) AddDevice(goCtx context.Context, msg *types.MsgAddDevice) (*types.MsgAddDeviceResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Fetch existing user profile
	profile, err := k.UserProfiles.Get(ctx, msg.Username)
	if err != nil {
		return nil, errorsmod.Wrapf(types.ErrUsernameNotFound, "username %q not found", msg.Username)
	}

	// Check max devices limit (from params, default 10)
	params, err := k.Params.Get(ctx)
	if err != nil {
		return nil, err
	}
	if profile.DeviceCount >= params.MaxDevicesPerUser {
		return nil, errorsmod.Wrapf(types.ErrMaxDevicesReached, "user %q has reached the maximum of %d active devices", msg.Username, params.MaxDevicesPerUser)
	}

	// Validate new commitment: 32 non-zero bytes
	if len(msg.NewCommitment) != 32 {
		return nil, errorsmod.Wrapf(types.ErrInvalidCommitment, "commitment must be exactly 32 bytes")
	}
	allZero := true
	for _, b := range msg.NewCommitment {
		if b != 0 {
			allZero = false
			break
		}
	}
	if allZero {
		return nil, errorsmod.Wrapf(types.ErrInvalidCommitment, "commitment must be non-zero")
	}

	// Validate pubkey and verify signature
	if len(msg.ControlPubkey) != 65 || msg.ControlPubkey[0] != 0x04 {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey must be 65-byte uncompressed P-256 point")
	}
	x := new(big.Int).SetBytes(msg.ControlPubkey[1:33])
	y := new(big.Int).SetBytes(msg.ControlPubkey[33:65])
	if !elliptic.P256().IsOnCurve(x, y) {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey is not on P-256 curve")
	}

	// Verify the stored control key hash matches
	keyHash := sha256.Sum256(msg.ControlPubkey)
	storedHash := profile.ControlKeyHash
	if len(storedHash) != 32 {
		return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "stored control key hash is malformed")
	}
	for i := range keyHash {
		if keyHash[i] != storedHash[i] {
			return nil, errorsmod.Wrapf(types.ErrInvalidPubkey, "control pubkey does not match registered key for username %q", msg.Username)
		}
	}

	pubKey := &ecdsa.PublicKey{Curve: elliptic.P256(), X: x, Y: y}
	payloadHash := sha256.Sum256(msg.Payload)
	if !ecdsa.VerifyASN1(pubKey, payloadHash[:], msg.IdentitySig) {
		return nil, errorsmod.Wrapf(types.ErrInvalidSignature, "identity signature verification failed")
	}

	// New device index is TotalDeviceCount (includes previously revoked devices)
	newIndex := profile.TotalDeviceCount

	device := types.DeviceCommitment{
		Username:   msg.Username,
		Index:      newIndex,
		Commitment: msg.NewCommitment,
		AddedAt:    ctx.BlockTime().Unix(),
		Revoked:    false,
		RevokedAt:  0,
	}
	if err := k.DeviceCommitments.Set(ctx, collections.Join(msg.Username, newIndex), device); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to store device commitment")
	}

	// Recompute the commitment Merkle root now that a new device is included.
	commitmentRoot, err := k.recomputeCommitmentRoot(ctx, msg.Username)
	if err != nil {
		return nil, errorsmod.Wrapf(err, "failed to compute commitment root")
	}

	// Update profile
	profile.CommitmentRoot = commitmentRoot
	profile.DeviceCount++
	profile.TotalDeviceCount++
	if err := k.UserProfiles.Set(ctx, msg.Username, profile); err != nil {
		return nil, errorsmod.Wrapf(err, "failed to update user profile")
	}

	ctx.EventManager().EmitEvent(sdk.NewEvent(
		types.EventTypeDeviceAdded,
		sdk.NewAttribute(types.AttributeKeyUsername, msg.Username),
	))

	return &types.MsgAddDeviceResponse{}, nil
}

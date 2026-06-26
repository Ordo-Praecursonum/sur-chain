package keeper

import (
	"context"

	"cosmossdk.io/collections"
	errorsmod "cosmossdk.io/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/surprotocol/surchain/x/identity/types"
)

func (q queryServer) GetDeviceCommitment(ctx context.Context, req *types.QueryGetDeviceCommitmentRequest) (*types.QueryGetDeviceCommitmentResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	if req.Username == "" {
		return nil, status.Error(codes.InvalidArgument, "username is required")
	}

	device, err := q.k.DeviceCommitments.Get(ctx, collections.Join(req.Username, req.DeviceIndex))
	if err != nil {
		return nil, status.Error(codes.NotFound, errorsmod.Wrapf(types.ErrDeviceNotFound, "device %d not found for user %q", req.DeviceIndex, req.Username).Error())
	}

	return &types.QueryGetDeviceCommitmentResponse{
		Commitment: device.Commitment,
		AddedAt:    device.AddedAt,
		Revoked:    device.Revoked,
	}, nil
}

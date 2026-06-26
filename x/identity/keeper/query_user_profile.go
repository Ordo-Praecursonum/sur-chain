package keeper

import (
	"context"

	errorsmod "cosmossdk.io/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/surprotocol/surchain/x/identity/types"
)

func (q queryServer) GetUserProfile(ctx context.Context, req *types.QueryGetUserProfileRequest) (*types.QueryGetUserProfileResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	if req.Username == "" {
		return nil, status.Error(codes.InvalidArgument, "username is required")
	}

	profile, err := q.k.UserProfiles.Get(ctx, req.Username)
	if err != nil {
		return nil, status.Error(codes.NotFound, errorsmod.Wrapf(types.ErrUsernameNotFound, "username %q not found", req.Username).Error())
	}

	return &types.QueryGetUserProfileResponse{
		Username:         profile.Username,
		ControlKeyHash:   profile.ControlKeyHash,
		RegisteredAt:     profile.RegisteredAt,
		CommitmentRoot:   profile.CommitmentRoot,
		DeviceCount:      profile.DeviceCount,
		TotalDeviceCount: profile.TotalDeviceCount,
	}, nil
}

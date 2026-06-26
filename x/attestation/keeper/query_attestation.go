package keeper

import (
	"context"
	"encoding/hex"
	"strings"

	"cosmossdk.io/collections"
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/surprotocol/surchain/x/attestation/types"
)

func (q queryServer) IsNullifierUsed(ctx context.Context, req *types.QueryIsNullifierUsedRequest) (*types.QueryIsNullifierUsedResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	if len(req.Nullifier) == 0 {
		return nil, status.Error(codes.InvalidArgument, "nullifier is required")
	}

	used, err := q.k.Nullifiers.Get(ctx, req.Nullifier)
	if err != nil {
		// ErrNotFound means nullifier was never used
		return &types.QueryIsNullifierUsedResponse{Used: false}, nil
	}

	return &types.QueryIsNullifierUsedResponse{Used: used}, nil
}

func (q queryServer) GetAttestation(ctx context.Context, req *types.QueryGetAttestationRequest) (*types.QueryGetAttestationResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	if req.Username == "" {
		return nil, status.Error(codes.InvalidArgument, "username is required")
	}
	if len(req.Nullifier) == 0 {
		return nil, status.Error(codes.InvalidArgument, "nullifier is required")
	}

	record, err := q.k.Attestations.Get(ctx, collections.Join(req.Username, req.Nullifier))
	if err != nil {
		return nil, status.Error(codes.NotFound, errorsmod.Wrapf(types.ErrNullifierAlreadyUsed, "attestation not found for user %q", req.Username).Error())
	}

	return &types.QueryGetAttestationResponse{
		Username:    record.Username,
		ContentHash: record.ContentHash,
		Nullifier:   record.Nullifier,
		Timestamp:   record.Timestamp,
	}, nil
}

// VerifyContent returns every human-typing attestation bound to the given
// content hash (hex-encoded SHA-256 of the content). A non-empty result proves
// the content was typed by a human on a registered Sur device.
func (q queryServer) VerifyContent(ctx context.Context, req *types.QueryVerifyContentRequest) (*types.QueryVerifyContentResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	hexStr := strings.TrimSpace(strings.TrimPrefix(strings.ToLower(req.ContentHashHex), "0x"))
	contentHash, err := hex.DecodeString(hexStr)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, "content_hash_hex must be hex-encoded")
	}
	if len(contentHash) != 32 {
		return nil, status.Error(codes.InvalidArgument, "content hash must be 32 bytes (SHA-256)")
	}

	resp := &types.QueryVerifyContentResponse{
		ContentHash:  contentHash,
		Attestations: []*types.AttestationMatch{},
	}

	// Scan every (content_hash, nullifier) pair sharing this content hash prefix.
	rng := collections.NewPrefixedPairRange[[]byte, []byte](contentHash)
	err = q.k.ContentIndex.Walk(ctx, rng, func(_ collections.Pair[[]byte, []byte], record types.AttestationRecord) (bool, error) {
		resp.Attestations = append(resp.Attestations, &types.AttestationMatch{
			Username:       record.Username,
			Nullifier:      record.Nullifier,
			CommitmentRoot: record.CommitmentRoot,
			Timestamp:      record.Timestamp,
			Origin:         record.Origin,
			Citation:       record.Citation,
		})
		return false, nil
	})
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	resp.Found = len(resp.Attestations) > 0
	return resp, nil
}

// AggregateRoot returns the keccak Merkle root over all accepted attestations.
func (q queryServer) AggregateRoot(ctx context.Context, req *types.QueryAggregateRootRequest) (*types.QueryAggregateRootResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	root, leafCount, err := q.k.BuildAggregateRoot(ctx)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &types.QueryAggregateRootResponse{
		Root:      root,
		LeafCount: leafCount,
		Height:    sdk.UnwrapSDKContext(ctx).BlockHeight(),
	}, nil
}

// MerkleProof returns an inclusion proof for the given content hash against the
// current aggregate root.
func (q queryServer) MerkleProof(ctx context.Context, req *types.QueryMerkleProofRequest) (*types.QueryMerkleProofResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	hexStr := strings.TrimSpace(strings.TrimPrefix(strings.ToLower(req.ContentHashHex), "0x"))
	contentHash, err := hex.DecodeString(hexStr)
	if err != nil || len(contentHash) != 32 {
		return nil, status.Error(codes.InvalidArgument, "content_hash_hex must be 32-byte hex")
	}
	root, leaf, proof, found, err := q.k.BuildMerkleProofForContent(ctx, contentHash)
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return &types.QueryMerkleProofResponse{
		Found: found,
		Root:  root,
		Leaf:  leaf,
		Proof: proof,
	}, nil
}

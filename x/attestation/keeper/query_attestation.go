package keeper

import (
	"context"
	"encoding/hex"
	"fmt"
	"strings"

	"cosmossdk.io/collections"
	errorsmod "cosmossdk.io/errors"
	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/bech32"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/surprotocol/surchain/x/attestation/types"
)

// resolveIdentifier normalizes a caller-supplied identity into the identifier
// string attestations are stored under. A hex-encoded 33-byte compressed
// secp256k1 public key (with or without 0x) is converted to the device id via
// the same derivation used at submission time (bech32(surdev,
// ripemd160(sha256(pubkey)))); anything else — surdev1…/surai1… ids and legacy
// plain usernames alike — is matched literally. Junk identifiers therefore
// yield found=false rather than an error; only an empty identifier errors.
func resolveIdentifier(raw string) (string, error) {
	id := strings.TrimSpace(raw)
	if id == "" {
		return "", fmt.Errorf("identifier is required")
	}

	// A 66-char hex string is unambiguously a compressed pubkey — stored
	// identifiers are capped at 64 chars by the register regex, so no stored
	// identifier can collide with this form.
	keyHex := strings.TrimPrefix(strings.ToLower(id), "0x")
	if len(keyHex) == 66 {
		if keyBytes, err := hex.DecodeString(keyHex); err == nil {
			pub := &secp256k1.PubKey{Key: keyBytes}
			derived, err := bech32.ConvertAndEncode(deviceIDHRP, pub.Address().Bytes())
			if err != nil {
				return "", fmt.Errorf("failed to derive device id from pubkey: %w", err)
			}
			return derived, nil
		}
	}

	return id, nil
}

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

// VerifyContentBy answers "did THIS identity attest THIS content?" — the scoped
// variant of VerifyContent. identifier may be a bech32 surdev1…/surai1… id or a
// hex-encoded 33-byte compressed secp256k1 public key (the id is derived from
// it, exactly as verifyDeclaration does for submissions).
func (q queryServer) VerifyContentBy(ctx context.Context, req *types.QueryVerifyContentByRequest) (*types.QueryVerifyContentByResponse, error) {
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

	identifier, err := resolveIdentifier(req.Identifier)
	if err != nil {
		return nil, status.Error(codes.InvalidArgument, err.Error())
	}

	resp := &types.QueryVerifyContentByResponse{
		ContentHash:  contentHash,
		Identifier:   identifier,
		Attestations: []*types.AttestationMatch{},
	}

	rng := collections.NewPrefixedPairRange[[]byte, []byte](contentHash)
	err = q.k.ContentIndex.Walk(ctx, rng, func(_ collections.Pair[[]byte, []byte], record types.AttestationRecord) (bool, error) {
		if record.Username != identifier {
			return false, nil
		}
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

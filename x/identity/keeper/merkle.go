package keeper

// merkle.go computes the device-commitment Merkle root exactly as the Sur
// attestation circuit expects it (surcorelibs/gnark/circuit.go), replacing the
// previous behaviour where RegisterUsername stored the raw first commitment as
// the "root" and AddDevice never updated it.
//
// Tree construction (must match the circuit):
//   - Depth 8 → 256 leaves, one per device index.
//   - leaf[i] = Poseidon(commitment_i)   where Poseidon(x) == HashTwo(x, 0)
//     (the circuit's 1-input gadget is a t=3 permutation with zero padding).
//   - empty leaf = 0 (field zero) for unused / revoked indices.
//   - internal node = Poseidon(left, right) = HashTwo(left, right).
//
// A freshly registered single device at index 0 therefore has Merkle path
// [0, H(0,0), H(H(0,0),H(0,0)), ...] with all directions = 0; this is the path
// the device supplies to the prover.

import (
	"context"
	"fmt"
	"math/big"

	"cosmossdk.io/collections"
	iposeidon "github.com/iden3/go-iden3-crypto/poseidon"
)

const (
	merkleDepth = 8
	numLeaves   = 1 << merkleDepth // 256
)

// bn254R is the BN254 scalar field modulus.
var bn254R, _ = new(big.Int).SetString(
	"21888242871839275222246405745257275088548364400416034343698204186575808495617", 10)

func poseidonHashTwo(a, b *big.Int) (*big.Int, error) {
	return iposeidon.Hash([]*big.Int{
		new(big.Int).Mod(a, bn254R),
		new(big.Int).Mod(b, bn254R),
	})
}

// ComputeCommitmentRoot builds the depth-8 Poseidon Merkle root over the active
// device commitments, keyed by device index. Empty/revoked indices use the zero
// leaf. The result is a 32-byte big-endian field element.
func ComputeCommitmentRoot(commitmentsByIndex map[uint64][]byte) ([]byte, error) {
	level := make([]*big.Int, numLeaves)
	for i := range level {
		level[i] = big.NewInt(0)
	}
	for idx, c := range commitmentsByIndex {
		if idx >= numLeaves {
			return nil, fmt.Errorf("device index %d exceeds max %d for depth-%d tree", idx, numLeaves-1, merkleDepth)
		}
		commitmentField := new(big.Int).Mod(new(big.Int).SetBytes(c), bn254R)
		leaf, err := poseidonHashTwo(commitmentField, big.NewInt(0)) // Poseidon(commitment)
		if err != nil {
			return nil, fmt.Errorf("leaf hash: %w", err)
		}
		level[idx] = leaf
	}

	for len(level) > 1 {
		next := make([]*big.Int, len(level)/2)
		for i := range next {
			node, err := poseidonHashTwo(level[2*i], level[2*i+1])
			if err != nil {
				return nil, fmt.Errorf("node hash: %w", err)
			}
			next[i] = node
		}
		level = next
	}

	out := make([]byte, 32)
	level[0].FillBytes(out)
	return out, nil
}

// emptySubtreeRoots returns the root of an all-empty subtree at each level
// 0..merkleDepth-1, i.e. the sibling hashes on the inclusion path of a single
// device at index 0. Exposed for the device's Merkle-path construction and for
// tests that assert circuit consistency.
func emptySubtreeRoots() ([]*big.Int, error) {
	roots := make([]*big.Int, merkleDepth)
	cur := big.NewInt(0) // empty leaf
	for i := 0; i < merkleDepth; i++ {
		roots[i] = new(big.Int).Set(cur)
		next, err := poseidonHashTwo(cur, cur)
		if err != nil {
			return nil, err
		}
		cur = next
	}
	return roots, nil
}

// recomputeCommitmentRoot gathers a user's active (non-revoked) device
// commitments and returns the Poseidon Merkle root over them.
func (k Keeper) recomputeCommitmentRoot(ctx context.Context, username string) ([]byte, error) {
	commitments := make(map[uint64][]byte)
	rng := collections.NewPrefixedPairRange[string, uint64](username)
	iter, err := k.DeviceCommitments.Iterate(ctx, rng)
	if err != nil {
		return nil, err
	}
	defer iter.Close()
	for ; iter.Valid(); iter.Next() {
		kv, err := iter.KeyValue()
		if err != nil {
			return nil, err
		}
		dev := kv.Value
		if dev.Revoked {
			continue
		}
		commitments[kv.Key.K2()] = dev.Commitment
	}
	return ComputeCommitmentRoot(commitments)
}

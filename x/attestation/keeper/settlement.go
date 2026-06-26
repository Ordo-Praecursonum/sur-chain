package keeper

import (
	"bytes"
	"context"
	"sort"

	"cosmossdk.io/collections"
	"golang.org/x/crypto/sha3"

	"github.com/surprotocol/surchain/x/attestation/types"
)

// Settlement aggregation: the chain batches its accepted attestations into a
// keccak256 sorted-pair Merkle root (the same scheme the Ethereum
// AttestationSettlement contract verifies against), so a relayer can anchor the
// root on Ethereum and anyone can later prove a specific attestation was
// included in a settled batch.
//
// Leaf formula (must match the off-chain verifier):
//   leaf = keccak256( keccak256(deviceId) ‖ contentHash ‖ nullifier ‖ keccak256(origin) )
// Internal node = keccak256( min(a,b) ‖ max(a,b) ).

func keccak256(parts ...[]byte) []byte {
	h := sha3.NewLegacyKeccak256()
	for _, p := range parts {
		h.Write(p)
	}
	return h.Sum(nil)
}

// attestationLeaf computes the Merkle leaf for one attestation record.
func attestationLeaf(r types.AttestationRecord) []byte {
	origin := r.Origin
	if origin == "" {
		origin = originHumanKeyboard
	}
	return keccak256(
		keccak256([]byte(r.Username)),
		r.ContentHash,
		r.Nullifier,
		keccak256([]byte(origin)),
	)
}

// hashPair hashes two nodes in ascending byte order (commutative), matching the
// contract's _hashPair.
func hashPair(a, b []byte) []byte {
	if bytes.Compare(a, b) <= 0 {
		return keccak256(a, b)
	}
	return keccak256(b, a)
}

// merkleRoot builds the sorted-pair keccak root over the (already sorted) leaves.
// Returns 32 zero bytes for an empty set.
func merkleRoot(leaves [][]byte) []byte {
	if len(leaves) == 0 {
		return make([]byte, 32)
	}
	level := leaves
	for len(level) > 1 {
		next := make([][]byte, 0, (len(level)+1)/2)
		for i := 0; i < len(level); i += 2 {
			if i+1 < len(level) {
				next = append(next, hashPair(level[i], level[i+1]))
			} else {
				next = append(next, level[i]) // odd one out is promoted
			}
		}
		level = next
	}
	return level[0]
}

// merkleProof returns the sibling path proving leaves[index] is in the tree.
func merkleProof(leaves [][]byte, index int) [][]byte {
	proof := [][]byte{}
	level := leaves
	i := index
	for len(level) > 1 {
		if i^1 < len(level) {
			proof = append(proof, level[i^1])
		}
		next := make([][]byte, 0, (len(level)+1)/2)
		for j := 0; j < len(level); j += 2 {
			if j+1 < len(level) {
				next = append(next, hashPair(level[j], level[j+1]))
			} else {
				next = append(next, level[j])
			}
		}
		level = next
		i /= 2
	}
	return proof
}

// collectSortedLeaves walks all accepted attestations and returns their leaves
// sorted ascending (deterministic ordering for a reproducible root).
func (k Keeper) collectSortedLeaves(ctx context.Context) ([][]byte, error) {
	var leaves [][]byte
	err := k.Attestations.Walk(ctx, nil, func(_ collections.Pair[string, []byte], r types.AttestationRecord) (bool, error) {
		leaves = append(leaves, attestationLeaf(r))
		return false, nil
	})
	if err != nil {
		return nil, err
	}
	sort.Slice(leaves, func(i, j int) bool { return bytes.Compare(leaves[i], leaves[j]) < 0 })
	return leaves, nil
}

// BuildAggregateRoot computes the current aggregate Merkle root over all accepted
// attestations and the leaf count.
func (k Keeper) BuildAggregateRoot(ctx context.Context) (root []byte, leafCount uint64, err error) {
	leaves, err := k.collectSortedLeaves(ctx)
	if err != nil {
		return nil, 0, err
	}
	return merkleRoot(leaves), uint64(len(leaves)), nil
}

// BuildMerkleProofForContent finds the first attestation whose content hash equals
// contentHash and returns (root, leaf, proof). found=false if none.
func (k Keeper) BuildMerkleProofForContent(ctx context.Context, contentHash []byte) (root, leaf []byte, proof [][]byte, found bool, err error) {
	leaves, err := k.collectSortedLeaves(ctx)
	if err != nil {
		return nil, nil, nil, false, err
	}
	root = merkleRoot(leaves)

	// Recompute the target leaf from the first matching attestation record.
	var target []byte
	err = k.ContentIndex.Walk(ctx,
		collections.NewPrefixedPairRange[[]byte, []byte](contentHash),
		func(_ collections.Pair[[]byte, []byte], r types.AttestationRecord) (bool, error) {
			target = attestationLeaf(r)
			return true, nil // first match only
		})
	if err != nil {
		return nil, nil, nil, false, err
	}
	if target == nil {
		return root, nil, nil, false, nil
	}
	// Locate the target leaf's index in the sorted set.
	idx := sort.Search(len(leaves), func(i int) bool { return bytes.Compare(leaves[i], target) >= 0 })
	if idx >= len(leaves) || !bytes.Equal(leaves[idx], target) {
		return root, target, nil, false, nil
	}
	return root, target, merkleProof(leaves, idx), true, nil
}

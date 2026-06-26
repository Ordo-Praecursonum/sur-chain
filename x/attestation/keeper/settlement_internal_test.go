package keeper

import (
	"bytes"
	"testing"

	"github.com/surprotocol/surchain/x/attestation/types"
)

// foldProof reproduces the Ethereum contract's _processProof: fold the leaf with
// each sibling using the sorted-pair keccak hash. A correct proof must reproduce
// the root, exactly as AttestationSettlement.verifyInclusion checks on L1.
func foldProof(leaf []byte, proof [][]byte) []byte {
	computed := leaf
	for _, sib := range proof {
		computed = hashPair(computed, sib)
	}
	return computed
}

func TestMerkleProofFoldsToRoot(t *testing.T) {
	// Build leaves from several attestation records.
	var leaves [][]byte
	for i := 0; i < 5; i++ {
		leaves = append(leaves, attestationLeaf(types.AttestationRecord{
			Username:    "surdev1abc",
			ContentHash: keccak256([]byte{byte(i)}),
			Nullifier:   keccak256([]byte{byte(100 + i)}),
			Origin:      "human_keyboard",
		}))
	}
	// Sort to the canonical order the keeper uses.
	sortLeaves(leaves)
	root := merkleRoot(leaves)

	for i := range leaves {
		proof := merkleProof(leaves, i)
		got := foldProof(leaves[i], proof)
		if !bytes.Equal(got, root) {
			t.Fatalf("leaf %d: proof folds to %x, want root %x", i, got, root)
		}
	}
}

func TestMerkleRootKnownAnswerTwoLeaf(t *testing.T) {
	a := keccak256([]byte("a"))
	b := keccak256([]byte("b"))
	leaves := [][]byte{a, b}
	sortLeaves(leaves)
	// 2-leaf root is just the sorted-pair hash — matches the contract's _hashPair.
	want := hashPair(leaves[0], leaves[1])
	if !bytes.Equal(merkleRoot(leaves), want) {
		t.Fatalf("2-leaf root mismatch")
	}
	// And the single-sibling proof folds back to the root.
	if !bytes.Equal(foldProof(leaves[0], merkleProof(leaves, 0)), want) {
		t.Fatalf("proof[0] does not fold to root")
	}
}

func TestMerkleRootEmpty(t *testing.T) {
	root := merkleRoot(nil)
	if len(root) != 32 || !bytes.Equal(root, make([]byte, 32)) {
		t.Fatalf("empty root must be 32 zero bytes, got %x", root)
	}
}

// sortLeaves mirrors the in-place sort used by collectSortedLeaves.
func sortLeaves(leaves [][]byte) {
	for i := 1; i < len(leaves); i++ {
		for j := i; j > 0 && bytes.Compare(leaves[j-1], leaves[j]) > 0; j-- {
			leaves[j-1], leaves[j] = leaves[j], leaves[j-1]
		}
	}
}

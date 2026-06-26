package keeper

// merkle_test.go is in package keeper (not keeper_test) so it can reach the
// unexported emptySubtreeRoots / poseidonHashTwo helpers used to assert that
// the chain's commitment-root construction matches the attestation circuit.

import (
	"bytes"
	"math/big"
	"testing"
)

func TestComputeCommitmentRoot_Deterministic(t *testing.T) {
	c := make([]byte, 32)
	c[0] = 0x01
	leaves := map[uint64][]byte{0: c}

	r1, err := ComputeCommitmentRoot(leaves)
	if err != nil {
		t.Fatalf("root: %v", err)
	}
	r2, err := ComputeCommitmentRoot(leaves)
	if err != nil {
		t.Fatalf("root: %v", err)
	}
	if !bytes.Equal(r1, r2) {
		t.Fatal("commitment root is not deterministic")
	}
	if len(r1) != 32 {
		t.Fatalf("root = %d bytes, want 32", len(r1))
	}
	if bytes.Equal(r1, make([]byte, 32)) {
		t.Fatal("root is unexpectedly zero")
	}
}

func TestComputeCommitmentRoot_ChangesWithDevice(t *testing.T) {
	c0 := make([]byte, 32)
	c0[0] = 0x01
	c1 := make([]byte, 32)
	c1[0] = 0x02

	one, err := ComputeCommitmentRoot(map[uint64][]byte{0: c0})
	if err != nil {
		t.Fatal(err)
	}
	two, err := ComputeCommitmentRoot(map[uint64][]byte{0: c0, 1: c1})
	if err != nil {
		t.Fatal(err)
	}
	if bytes.Equal(one, two) {
		t.Fatal("adding a device did not change the commitment root")
	}
}

// TestComputeCommitmentRoot_MatchesCircuitPath verifies that for a single
// device at index 0 the root equals folding leaf=Poseidon(commitment) up the
// tree with the empty-subtree sibling at each level — i.e. the exact Merkle
// path the device feeds to the attestation circuit (directions all 0).
func TestComputeCommitmentRoot_MatchesCircuitPath(t *testing.T) {
	c := make([]byte, 32)
	c[0] = 0x07
	for i := 1; i < 32; i++ {
		c[i] = byte(i)
	}

	root, err := ComputeCommitmentRoot(map[uint64][]byte{0: c})
	if err != nil {
		t.Fatal(err)
	}

	// Manually fold using the documented construction.
	commitmentField := new(big.Int).Mod(new(big.Int).SetBytes(c), bn254R)
	cur, err := poseidonHashTwo(commitmentField, big.NewInt(0)) // leaf = Poseidon(commitment)
	if err != nil {
		t.Fatal(err)
	}
	siblings, err := emptySubtreeRoots()
	if err != nil {
		t.Fatal(err)
	}
	for i := 0; i < merkleDepth; i++ {
		// direction 0: current is the left child, sibling on the right.
		cur, err = poseidonHashTwo(cur, siblings[i])
		if err != nil {
			t.Fatal(err)
		}
	}
	want := make([]byte, 32)
	cur.FillBytes(want)

	if !bytes.Equal(root, want) {
		t.Fatalf("root mismatch:\n got  %x\n want %x", root, want)
	}
}

func TestComputeCommitmentRoot_IndexOutOfRange(t *testing.T) {
	c := make([]byte, 32)
	c[0] = 0x01
	if _, err := ComputeCommitmentRoot(map[uint64][]byte{numLeaves: c}); err == nil {
		t.Fatal("expected error for device index >= numLeaves")
	}
}

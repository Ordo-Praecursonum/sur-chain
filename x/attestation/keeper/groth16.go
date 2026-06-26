package keeper

// groth16.go implements real Groth16 verification of device attestation proofs.
//
// It replaces the previous placeholder that always returned true.  The verifier:
//   1. reconstructs the canonical public-inputs vector from the message fields
//        [username_hash, content_hash_lo, content_hash_hi, nullifier, commitment_root]
//      (username_hash via Poseidon over the username, content hash split into
//      128-bit halves), exactly as the device prover built them;
//   2. deserializes the 256-byte proof (EIP-197 layout: A||B||C); and
//   3. runs gnark groth16.Verify against the embedded verifying key.
//
// The verifying key (keys/attestation.vk) is a byte-for-byte copy of the key the
// prover uses in surcorelibs; it is generated there and copied here by
// `go run ./cmd/genfixture` in the surcorelibs module.  The shared canonical
// Poseidon parameters and field-element encodings are documented in
// docs/INTEGRATION.md and gated by the Poseidon([1,2]) test vector.

import (
	"bytes"
	_ "embed"
	"fmt"
	"math/big"
	"sync"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend/groth16"
	groth16bn254 "github.com/consensys/gnark/backend/groth16/bn254"
	"github.com/consensys/gnark/backend/witness"
	"github.com/consensys/gnark/frontend"
	iposeidon "github.com/iden3/go-iden3-crypto/poseidon"
)

//go:embed keys/attestation.vk
var attestationVKBytes []byte

var (
	vkOnce sync.Once
	vkInst groth16.VerifyingKey
	vkErr  error
)

// usernameLimbBytes mirrors surcorelibs/gnark/publicinputs.go: 31 UTF-8 bytes
// per BN254 field limb keeps every limb below the scalar field modulus.
const usernameLimbBytes = 31

// bn254R is the BN254 scalar field modulus (matches surcorelibs/poseidon).
var bn254R, _ = new(big.Int).SetString(
	"21888242871839275222246405745257275088548364400416034343698204186575808495617", 10)

// loadVerifyingKey deserializes the embedded verifying key once.
func loadVerifyingKey() (groth16.VerifyingKey, error) {
	vkOnce.Do(func() {
		v := groth16.NewVerifyingKey(ecc.BN254)
		if _, err := v.ReadFrom(bytes.NewReader(attestationVKBytes)); err != nil {
			vkErr = fmt.Errorf("attestation: load verifying key: %w", err)
			return
		}
		vkInst = v
	})
	return vkInst, vkErr
}

// VerifyAttestationProof verifies a device attestation proof against the
// reconstructed public inputs.  It returns nil iff the proof is valid.
func VerifyAttestationProof(username string, contentHash, nullifier, commitmentRoot, proofBytes []byte) error {
	if len(contentHash) != 32 {
		return fmt.Errorf("content hash must be 32 bytes, got %d", len(contentHash))
	}
	if len(nullifier) != 32 {
		return fmt.Errorf("nullifier must be 32 bytes, got %d", len(nullifier))
	}
	if len(commitmentRoot) != 32 {
		return fmt.Errorf("commitment root must be 32 bytes, got %d", len(commitmentRoot))
	}
	if len(proofBytes) != 256 {
		return fmt.Errorf("proof must be 256 bytes, got %d", len(proofBytes))
	}

	vk, err := loadVerifyingKey()
	if err != nil {
		return err
	}

	proof, err := deserializeProof(proofBytes)
	if err != nil {
		return err
	}

	usernameHash, err := usernameHashField(username)
	if err != nil {
		return err
	}
	lo, hi := splitContentHash(contentHash)
	pub, err := publicWitness(
		usernameHash,
		lo,
		hi,
		new(big.Int).SetBytes(nullifier),
		new(big.Int).SetBytes(commitmentRoot),
	)
	if err != nil {
		return err
	}

	if err := groth16.Verify(proof, vk, pub); err != nil {
		return fmt.Errorf("groth16 verification failed: %w", err)
	}
	return nil
}

// attestationPublicCircuit holds ONLY the public inputs of AttestationCircuit,
// in the same declaration order, so frontend.NewWitness(..., PublicOnly())
// produces the identical public-witness vector the circuit was compiled with.
// Define is never invoked during witness construction; it exists to satisfy
// frontend.Circuit.
type attestationPublicCircuit struct {
	UsernameHash   frontend.Variable `gnark:",public"`
	ContentHashLo  frontend.Variable `gnark:",public"`
	ContentHashHi  frontend.Variable `gnark:",public"`
	Nullifier      frontend.Variable `gnark:",public"`
	CommitmentRoot frontend.Variable `gnark:",public"`
}

func (c *attestationPublicCircuit) Define(_ frontend.API) error { return nil }

func publicWitness(uh, lo, hi, nullifier, root *big.Int) (witness.Witness, error) {
	assignment := &attestationPublicCircuit{
		UsernameHash:   uh,
		ContentHashLo:  lo,
		ContentHashHi:  hi,
		Nullifier:      nullifier,
		CommitmentRoot: root,
	}
	return frontend.NewWitness(assignment, ecc.BN254.ScalarField(), frontend.PublicOnly())
}

// deserializeProof reconstructs a bn254 Groth16 proof from the 256-byte
// A(64)||B(128)||C(64) wire format produced by surcorelibs serializeProof.
func deserializeProof(b []byte) (groth16.Proof, error) {
	p := &groth16bn254.Proof{}
	if err := p.Ar.Unmarshal(b[0:64]); err != nil {
		return nil, fmt.Errorf("deserialize proof Ar: %w", err)
	}
	if err := p.Bs.Unmarshal(b[64:192]); err != nil {
		return nil, fmt.Errorf("deserialize proof Bs: %w", err)
	}
	if err := p.Krs.Unmarshal(b[192:256]); err != nil {
		return nil, fmt.Errorf("deserialize proof Krs: %w", err)
	}
	return p, nil
}

// usernameHashField computes Poseidon over the username's UTF-8 bytes packed
// into 31-byte big-endian limbs.  Mirrors surcorelibs gnark.UsernameHashField.
func usernameHashField(username string) (*big.Int, error) {
	b := []byte(username)
	if len(b) == 0 {
		return nil, fmt.Errorf("empty username")
	}
	var limbs []*big.Int
	for i := 0; i < len(b); i += usernameLimbBytes {
		end := i + usernameLimbBytes
		if end > len(b) {
			end = len(b)
		}
		limbs = append(limbs, new(big.Int).Mod(new(big.Int).SetBytes(b[i:end]), bn254R))
	}
	return iposeidon.Hash(limbs)
}

// splitContentHash splits a 32-byte content hash into (lo, hi): the low and
// high 128-bit big-endian halves.  Mirrors surcorelibs gnark.SplitContentHash.
func splitContentHash(h []byte) (lo, hi *big.Int) {
	hi = new(big.Int).SetBytes(h[0:16])
	lo = new(big.Int).SetBytes(h[16:32])
	return lo, hi
}

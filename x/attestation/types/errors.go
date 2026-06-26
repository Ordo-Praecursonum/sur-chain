package types

// DONTCOVER

import (
	"cosmossdk.io/errors"
)

// x/attestation module sentinel errors
var (
	ErrInvalidSigner       = errors.Register(ModuleName, 1100, "expected gov account as only signer for proposal message")
	ErrUsernameNotFound    = errors.Register(ModuleName, 1101, "username not found in identity module")
	ErrNullifierAlreadyUsed = errors.Register(ModuleName, 1102, "nullifier already used")
	ErrInvalidProof        = errors.Register(ModuleName, 1103, "invalid ZK proof")
	ErrInvalidContentHash  = errors.Register(ModuleName, 1104, "invalid content hash")
	ErrInvalidCommitmentRoot = errors.Register(ModuleName, 1105, "commitment root does not match registered root")
)

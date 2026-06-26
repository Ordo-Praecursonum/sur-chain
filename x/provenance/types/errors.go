package types

// DONTCOVER

import (
	"cosmossdk.io/errors"
)

// x/provenance module sentinel errors
var (
	ErrInvalidSigner        = errors.Register(ModuleName, 1100, "expected gov account as only signer for proposal message")
	ErrPrincipalAlreadyExists = errors.Register(ModuleName, 1101, "principal ID already registered")
	ErrPrincipalNotFound    = errors.Register(ModuleName, 1102, "principal not found")
	ErrInvalidSignature     = errors.Register(ModuleName, 1103, "invalid principal signature")
	ErrInvalidPubkey        = errors.Register(ModuleName, 1104, "invalid public key")
)

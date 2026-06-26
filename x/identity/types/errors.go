package types

// DONTCOVER

import (
	"cosmossdk.io/errors"
)

// x/identity module sentinel errors
var (
	ErrInvalidSigner     = errors.Register(ModuleName, 1100, "expected gov account as only signer for proposal message")
	ErrInvalidUsername   = errors.Register(ModuleName, 1101, "invalid username format")
	ErrUsernameTaken     = errors.Register(ModuleName, 1102, "username already registered")
	ErrInvalidPubkey     = errors.Register(ModuleName, 1103, "invalid control public key")
	ErrInvalidCommitment = errors.Register(ModuleName, 1104, "invalid device commitment")
	ErrInvalidSignature  = errors.Register(ModuleName, 1105, "invalid identity signature")
	ErrUsernameNotFound  = errors.Register(ModuleName, 1106, "username not found")
	ErrDeviceNotFound    = errors.Register(ModuleName, 1107, "device commitment not found")
	ErrDeviceAlreadyRevoked = errors.Register(ModuleName, 1108, "device already revoked")
	ErrMaxDevicesReached = errors.Register(ModuleName, 1109, "maximum devices per user reached")
)

package types

import (
	"context"

	"cosmossdk.io/core/address"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// AuthKeeper defines the expected interface for the Auth module.
type AuthKeeper interface {
	AddressCodec() address.Codec
	GetAccount(context.Context, sdk.AccAddress) sdk.AccountI // only used for simulation
	// Methods imported from account should be defined here
}

// BankKeeper defines the expected interface for the Bank module.
type BankKeeper interface {
	SpendableCoins(context.Context, sdk.AccAddress) sdk.Coins
	// Methods imported from bank should be defined here
}

// IdentityKeeper defines the expected interface for cross-module identity lookups.
type IdentityKeeper interface {
	HasUserProfile(ctx context.Context, username string) bool
	// GetCommitmentRoot returns the user's current device-commitment Merkle root
	// and whether the user exists. The attestation module binds each proof's
	// commitment_root to this value.
	GetCommitmentRoot(ctx context.Context, username string) ([]byte, bool)
}

// ParamSubspace defines the expected Subspace interface for parameters.
type ParamSubspace interface {
	Get(context.Context, []byte, interface{})
	Set(context.Context, []byte, interface{})
}

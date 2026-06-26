// Package ante provides custom ante handler decorators for Sur Chain.
// The FeeBurnDecorator enforces the SUR tokenomics fee split:
//   - 80% of every transaction fee is burned (sent to the module burn address)
//   - 20% is forwarded to the fee collector for validator distribution
//
// This split is a protocol-level invariant enforced deterministically for all
// transactions. Individual validators cannot modify the split. Governance may
// change the burn fraction via chain upgrade only.
package ante

import (
	"context"

	"cosmossdk.io/errors"
	"cosmossdk.io/math"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"
	govtypes "github.com/cosmos/cosmos-sdk/x/gov/types"
)

const (
	// BurnNumerator is the fraction of fees that are burned (80%).
	BurnNumerator = int64(80)
	// BurnDenominator is the denominator of the burn fraction.
	BurnDenominator = int64(100)
)

// BankBurnKeeper defines the minimal bank interface required by FeeBurnDecorator.
// Uses context.Context (not sdk.Context) to match the Cosmos SDK v0.53+ bank keeper signatures.
type BankBurnKeeper interface {
	SendCoinsFromAccountToModule(ctx context.Context, senderAddr sdk.AccAddress, recipientModule string, amt sdk.Coins) error
	BurnCoins(ctx context.Context, moduleName string, amounts sdk.Coins) error
}

// FeeBurnDecorator splits transaction fees 80/20: 80% is burned, 20% goes to
// the fee collector for validator distribution.
//
// It must run AFTER the DeductFeeDecorator (which already moves fees from the
// signer's account to the fee collector). FeeBurnDecorator then redistributes
// from the fee collector: moves 80% to the mint module account and burns it.
type FeeBurnDecorator struct {
	bankKeeper BankBurnKeeper
}

// NewFeeBurnDecorator constructs a FeeBurnDecorator.
func NewFeeBurnDecorator(bk BankBurnKeeper) FeeBurnDecorator {
	return FeeBurnDecorator{bankKeeper: bk}
}

// AnteHandle implements the AnteDecorator interface. It reads the declared fee
// from the transaction, computes the burn amount (80%), moves it from the fee
// collector to the mint module account, and burns it there.
func (fbd FeeBurnDecorator) AnteHandle(
	ctx sdk.Context,
	tx sdk.Tx,
	simulate bool,
	next sdk.AnteHandler,
) (sdk.Context, error) {
	feeTx, ok := tx.(sdk.FeeTx)
	if !ok {
		return ctx, errors.Wrap(sdkerrors.ErrTxDecode, "transaction does not implement sdk.FeeTx")
	}

	fees := feeTx.GetFee()
	if fees.IsZero() {
		// No fees — nothing to burn; continue.
		return next(ctx, tx, simulate)
	}

	// Compute burn amount: floor(fee * 80 / 100) per denomination.
	burnCoins := computeBurnAmount(fees)
	if burnCoins.IsZero() {
		return next(ctx, tx, simulate)
	}

	// In simulation mode we skip actual coin transfers.
	if !simulate {
		// Move the burn portion out of the fee collector and burn it. BurnCoins
		// requires the module account to hold the Burner permission — fee_collector
		// does NOT (it has no permissions), which previously panicked every
		// fee-paying tx with "fee_collector does not have permissions to burn".
		// We route through the gov module, which is granted Burner in genesis, so
		// this works on the existing chain state without a reset.
		var goCtx context.Context = ctx

		feeCollectorAddr := authtypes.NewModuleAddress(authtypes.FeeCollectorName)
		if err := fbd.bankKeeper.SendCoinsFromAccountToModule(
			goCtx, feeCollectorAddr, govtypes.ModuleName, burnCoins,
		); err != nil {
			// If the fee collector doesn't have enough, log and continue.
			ctx.Logger().Error("FeeBurnDecorator: failed to move burn coins", "error", err)
			return next(ctx, tx, simulate)
		}

		// Burn the coins from the gov module account (which has Burner permission).
		if err := fbd.bankKeeper.BurnCoins(goCtx, govtypes.ModuleName, burnCoins); err != nil {
			ctx.Logger().Error("FeeBurnDecorator: failed to burn coins", "error", err)
		}
	}

	return next(ctx, tx, simulate)
}

// computeBurnAmount returns floor(coins * BurnNumerator / BurnDenominator) for
// each denomination. Denominations with a computed burn amount of zero are
// omitted from the result.
func computeBurnAmount(fees sdk.Coins) sdk.Coins {
	var burn sdk.Coins
	for _, coin := range fees {
		// burn = floor(amount * 80 / 100)
		burnAmt := coin.Amount.Mul(math.NewInt(BurnNumerator)).Quo(math.NewInt(BurnDenominator))
		if burnAmt.IsPositive() {
			burn = burn.Add(sdk.NewCoin(coin.Denom, burnAmt))
		}
	}
	return burn
}

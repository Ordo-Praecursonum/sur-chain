// Package ante wires the Sur Chain ante handler chain.
package ante

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	authante "github.com/cosmos/cosmos-sdk/x/auth/ante"
	ibcante "github.com/cosmos/ibc-go/v10/modules/core/ante"
	ibckeeper "github.com/cosmos/ibc-go/v10/modules/core/keeper"
)

// HandlerOptions extends the standard SDK ante handler options with Sur-specific
// keepers needed for the 80/20 fee-burn decorator.
type HandlerOptions struct {
	authante.HandlerOptions
	IBCKeeper  *ibckeeper.Keeper
	BurnKeeper BankBurnKeeper
}

// NewAnteHandler constructs the full Sur Chain ante handler chain.
//
// Order:
//  1. SetUpContext — sets gas meter and tx size limit
//  2. ExtensionOptionsDecorator — rejects unknown proto Any extensions
//  3. ValidateBasicDecorator — validates the tx's basic structure
//  4. TxTimeoutHeightDecorator — enforces tx timeout height
//  5. ValidateMemoDecorator — validates memo length
//  6. ConsumeGasForTxSizeDecorator — charges gas for tx size
//  7. DeductFeeDecorator — deducts the declared fee from the signer
//  8. FeeBurnDecorator (Sur-specific) — burns 80% of the deducted fee
//  9. SetPubKeyDecorator — sets public keys for new accounts
//  10. ValidateSigCountDecorator — checks signature count limits
//  11. SigGasConsumeDecorator — charges gas for each signature
//  12. SigVerificationDecorator — verifies signatures
//  13. IncrementSequenceDecorator — increments account sequence numbers
//  14. IBCAnteDecorator — handles IBC-specific ante logic
func NewAnteHandler(opts HandlerOptions) (sdk.AnteHandler, error) {
	anteDecorators := []sdk.AnteDecorator{
		authante.NewSetUpContextDecorator(),
		authante.NewExtensionOptionsDecorator(opts.ExtensionOptionChecker),
		authante.NewValidateBasicDecorator(),
		authante.NewTxTimeoutHeightDecorator(),
		authante.NewValidateMemoDecorator(opts.AccountKeeper),
		authante.NewConsumeGasForTxSizeDecorator(opts.AccountKeeper),
		authante.NewDeductFeeDecorator(opts.AccountKeeper, opts.BankKeeper, opts.FeegrantKeeper, opts.TxFeeChecker),
		// Sur-specific: burn 80% of the already-deducted fee.
		NewFeeBurnDecorator(opts.BurnKeeper),
		authante.NewSetPubKeyDecorator(opts.AccountKeeper),
		authante.NewValidateSigCountDecorator(opts.AccountKeeper),
		authante.NewSigGasConsumeDecorator(opts.AccountKeeper, opts.SigGasConsumer),
		authante.NewSigVerificationDecorator(opts.AccountKeeper, opts.SignModeHandler),
		authante.NewIncrementSequenceDecorator(opts.AccountKeeper),
		ibcante.NewRedundantRelayDecorator(opts.IBCKeeper),
	}

	return sdk.ChainAnteDecorators(anteDecorators...), nil
}

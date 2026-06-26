package keeper_test

import (
	"context"
	"testing"

	"cosmossdk.io/core/address"
	storetypes "cosmossdk.io/store/types"
	addresscodec "github.com/cosmos/cosmos-sdk/codec/address"
	"github.com/cosmos/cosmos-sdk/runtime"
	"github.com/cosmos/cosmos-sdk/testutil"
	sdk "github.com/cosmos/cosmos-sdk/types"
	moduletestutil "github.com/cosmos/cosmos-sdk/types/module/testutil"
	authtypes "github.com/cosmos/cosmos-sdk/x/auth/types"

	"github.com/surprotocol/surchain/x/attestation/keeper"
	module "github.com/surprotocol/surchain/x/attestation/module"
	"github.com/surprotocol/surchain/x/attestation/types"
)

// mockIdentityKeeper is a simple mock for testing. It maps a username to its
// device-commitment root; presence of a key means the profile exists.
type mockIdentityKeeper struct {
	profiles map[string][]byte
}

func newMockIdentityKeeper() *mockIdentityKeeper {
	return &mockIdentityKeeper{profiles: make(map[string][]byte)}
}

func (m *mockIdentityKeeper) HasUserProfile(_ context.Context, username string) bool {
	_, ok := m.profiles[username]
	return ok
}

func (m *mockIdentityKeeper) GetCommitmentRoot(_ context.Context, username string) ([]byte, bool) {
	root, ok := m.profiles[username]
	return root, ok
}

// addProfile registers a user with an all-zero commitment root.
func (m *mockIdentityKeeper) addProfile(username string) {
	if _, ok := m.profiles[username]; !ok {
		m.profiles[username] = make([]byte, 32)
	}
}

// addProfileWithRoot registers a user with a specific commitment root.
func (m *mockIdentityKeeper) addProfileWithRoot(username string, root []byte) {
	m.profiles[username] = root
}

type fixture struct {
	ctx            context.Context
	keeper         keeper.Keeper
	addressCodec   address.Codec
	identityKeeper *mockIdentityKeeper
}

func initFixture(t *testing.T) *fixture {
	t.Helper()

	encCfg := moduletestutil.MakeTestEncodingConfig(module.AppModule{})
	addressCodec := addresscodec.NewBech32Codec(sdk.GetConfig().GetBech32AccountAddrPrefix())
	storeKey := storetypes.NewKVStoreKey(types.StoreKey)

	storeService := runtime.NewKVStoreService(storeKey)
	ctx := testutil.DefaultContextWithDB(t, storeKey, storetypes.NewTransientStoreKey("transient_test")).Ctx

	authority := authtypes.NewModuleAddress(types.GovModuleName)
	mockIdentity := newMockIdentityKeeper()

	k := keeper.NewKeeper(
		storeService,
		encCfg.Codec,
		addressCodec,
		authority,
		mockIdentity,
	)

	// Initialize params
	if err := k.Params.Set(ctx, types.DefaultParams()); err != nil {
		t.Fatalf("failed to set params: %v", err)
	}

	return &fixture{
		ctx:            ctx,
		keeper:         k,
		addressCodec:   addressCodec,
		identityKeeper: mockIdentity,
	}
}
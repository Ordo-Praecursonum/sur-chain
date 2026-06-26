package keeper

import (
	"context"
	"fmt"

	"cosmossdk.io/collections"
	"cosmossdk.io/core/address"
	corestore "cosmossdk.io/core/store"
	"github.com/cosmos/cosmos-sdk/codec"

	"github.com/surprotocol/surchain/x/identity/types"
)

// Key prefixes for collections
var (
	UserProfileKeyPrefix      = collections.NewPrefix(1)
	DeviceCommitmentKeyPrefix = collections.NewPrefix(2)
)

type Keeper struct {
	storeService corestore.KVStoreService
	cdc          codec.Codec
	addressCodec address.Codec
	// Address capable of executing a MsgUpdateParams message.
	authority []byte

	Schema collections.Schema
	Params collections.Item[types.Params]

	// UserProfiles maps username -> UserProfile
	UserProfiles collections.Map[string, types.UserProfile]
	// DeviceCommitments maps (username, deviceIndex) -> DeviceCommitment
	DeviceCommitments collections.Map[collections.Pair[string, uint64], types.DeviceCommitment]
}

func NewKeeper(
	storeService corestore.KVStoreService,
	cdc codec.Codec,
	addressCodec address.Codec,
	authority []byte,
) Keeper {
	if _, err := addressCodec.BytesToString(authority); err != nil {
		panic(fmt.Sprintf("invalid authority address %s: %s", authority, err))
	}

	sb := collections.NewSchemaBuilder(storeService)

	k := Keeper{
		storeService: storeService,
		cdc:          cdc,
		addressCodec: addressCodec,
		authority:    authority,

		Params: collections.NewItem(sb, types.ParamsKey, "params", codec.CollValue[types.Params](cdc)),
		UserProfiles: collections.NewMap(
			sb,
			UserProfileKeyPrefix,
			"user_profiles",
			collections.StringKey,
			codec.CollValue[types.UserProfile](cdc),
		),
		DeviceCommitments: collections.NewMap(
			sb,
			DeviceCommitmentKeyPrefix,
			"device_commitments",
			collections.PairKeyCodec(collections.StringKey, collections.Uint64Key),
			codec.CollValue[types.DeviceCommitment](cdc),
		),
	}

	schema, err := sb.Build()
	if err != nil {
		panic(err)
	}
	k.Schema = schema

	return k
}

// GetAuthority returns the module's authority.
func (k Keeper) GetAuthority() []byte {
	return k.authority
}

// HasUserProfile returns true if a UserProfile exists for the given username.
func (k Keeper) HasUserProfile(ctx context.Context, username string) bool {
	has, err := k.UserProfiles.Has(ctx, username)
	if err != nil {
		return false
	}
	return has
}

// GetCommitmentRoot returns the user's current device-commitment Merkle root
// and whether the user exists. Consumed by the x/attestation module to bind
// each proof's commitment_root to the registered root.
func (k Keeper) GetCommitmentRoot(ctx context.Context, username string) ([]byte, bool) {
	profile, err := k.UserProfiles.Get(ctx, username)
	if err != nil {
		return nil, false
	}
	return profile.CommitmentRoot, true
}

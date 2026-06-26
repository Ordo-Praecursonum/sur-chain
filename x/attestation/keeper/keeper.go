package keeper

import (
	"fmt"

	"cosmossdk.io/collections"
	"cosmossdk.io/core/address"
	corestore "cosmossdk.io/core/store"
	"github.com/cosmos/cosmos-sdk/codec"

	"github.com/surprotocol/surchain/x/attestation/types"
)

// Key prefixes for collections
var (
	NullifierKeyPrefix        = collections.NewPrefix(1)
	AttestationKeyPrefix      = collections.NewPrefix(2)
	ContentAttestationKeyPrefix = collections.NewPrefix(3)
)

type Keeper struct {
	storeService corestore.KVStoreService
	cdc          codec.Codec
	addressCodec address.Codec
	authority    []byte

	identityKeeper types.IdentityKeeper

	Schema collections.Schema
	Params collections.Item[types.Params]

	// Nullifiers maps nullifier_hex -> bool (used/not used)
	Nullifiers collections.Map[[]byte, bool]
	// Attestations maps (username, nullifier_hex) -> AttestationRecord
	Attestations collections.Map[collections.Pair[string, []byte], types.AttestationRecord]
	// ContentIndex maps (content_hash, nullifier) -> AttestationRecord, so content
	// origin can be verified by hash. Keyed by nullifier as the second component
	// because the same content may be attested by multiple users/sessions.
	ContentIndex collections.Map[collections.Pair[[]byte, []byte], types.AttestationRecord]
}

func NewKeeper(
	storeService corestore.KVStoreService,
	cdc codec.Codec,
	addressCodec address.Codec,
	authority []byte,
	identityKeeper types.IdentityKeeper,
) Keeper {
	if _, err := addressCodec.BytesToString(authority); err != nil {
		panic(fmt.Sprintf("invalid authority address %s: %s", authority, err))
	}

	sb := collections.NewSchemaBuilder(storeService)

	k := Keeper{
		storeService:   storeService,
		cdc:            cdc,
		addressCodec:   addressCodec,
		authority:      authority,
		identityKeeper: identityKeeper,

		Params: collections.NewItem(sb, types.ParamsKey, "params", codec.CollValue[types.Params](cdc)),
		Nullifiers: collections.NewMap(
			sb,
			NullifierKeyPrefix,
			"nullifiers",
			collections.BytesKey,
			collections.BoolValue,
		),
		Attestations: collections.NewMap(
			sb,
			AttestationKeyPrefix,
			"attestations",
			collections.PairKeyCodec(collections.StringKey, collections.BytesKey),
			codec.CollValue[types.AttestationRecord](cdc),
		),
		ContentIndex: collections.NewMap(
			sb,
			ContentAttestationKeyPrefix,
			"content_index",
			collections.PairKeyCodec(collections.BytesKey, collections.BytesKey),
			codec.CollValue[types.AttestationRecord](cdc),
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

package keeper

import (
	"fmt"

	"cosmossdk.io/collections"
	"cosmossdk.io/core/address"
	corestore "cosmossdk.io/core/store"
	"github.com/cosmos/cosmos-sdk/codec"

	"github.com/surprotocol/surchain/x/provenance/types"
)

// Key prefixes for collections
var (
	PrincipalKeyPrefix      = collections.NewPrefix(1)
	ProvenanceNodeKeyPrefix = collections.NewPrefix(2)
	NodeCounterKeyPrefix    = collections.NewPrefix(3)
	NodesByInKeyPrefix      = collections.NewPrefix(4)
	NodesByOutKeyPrefix     = collections.NewPrefix(5)
)

type Keeper struct {
	storeService corestore.KVStoreService
	cdc          codec.Codec
	addressCodec address.Codec
	authority    []byte

	Schema collections.Schema
	Params collections.Item[types.Params]

	// Principals maps principal_id -> PipelinePrincipal
	Principals collections.Map[string, types.PipelinePrincipal]
	// ProvenanceNodes maps node_id -> ProvenanceNode
	ProvenanceNodes collections.Map[string, types.ProvenanceNode]
	// NodeCounter tracks the total number of provenance nodes
	NodeCounter collections.Item[uint64]
	// NodesByIn indexes (content_hash_in, node_id) — walk a content's
	// descendants (everything derived FROM it) with a prefix scan.
	NodesByIn collections.KeySet[collections.Pair[[]byte, string]]
	// NodesByOut indexes (content_hash_out, node_id) — walk a content's
	// ancestors (what it was derived from) with a prefix scan.
	NodesByOut collections.KeySet[collections.Pair[[]byte, string]]
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
		Principals: collections.NewMap(
			sb,
			PrincipalKeyPrefix,
			"principals",
			collections.StringKey,
			codec.CollValue[types.PipelinePrincipal](cdc),
		),
		ProvenanceNodes: collections.NewMap(
			sb,
			ProvenanceNodeKeyPrefix,
			"provenance_nodes",
			collections.StringKey,
			codec.CollValue[types.ProvenanceNode](cdc),
		),
		NodeCounter: collections.NewItem(sb, NodeCounterKeyPrefix, "node_counter", collections.Uint64Value),
		NodesByIn: collections.NewKeySet(
			sb,
			NodesByInKeyPrefix,
			"nodes_by_in",
			collections.PairKeyCodec(collections.BytesKey, collections.StringKey),
		),
		NodesByOut: collections.NewKeySet(
			sb,
			NodesByOutKeyPrefix,
			"nodes_by_out",
			collections.PairKeyCodec(collections.BytesKey, collections.StringKey),
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

package keeper_test

import (
	"crypto/ecdsa"
	"crypto/sha256"
	"encoding/hex"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/surprotocol/surchain/x/provenance/keeper"
	"github.com/surprotocol/surchain/x/provenance/types"
)

// graphFixture registers a principal and records the transformation graph
//
//	A --ai_grammar--> B --human_edit--> C
//	A --translation--> D
//
// exercising both a linear chain and a branch from the same source.
type graphFixture struct {
	f          *fixture
	msgServer  types.MsgServer
	q          types.QueryServer
	key        *ecdsa.PrivateKey
	a, b, c, d []byte
}

func hashOf(s string) []byte {
	h := sha256.Sum256([]byte(s))
	return h[:]
}

func setupGraph(t *testing.T) graphFixture {
	t.Helper()
	f := initFixture(t)
	msgServer := keeper.NewMsgServerImpl(f.keeper)
	q := keeper.NewQueryServerImpl(f.keeper)

	key := generateTestKey(t)
	_, err := msgServer.RegisterPrincipal(f.ctx, &types.MsgRegisterPrincipal{
		Creator:       "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		PrincipalId:   "editor-1",
		Name:          "Graph Test Editor",
		Pubkey:        pubkeyBytes(&key.PublicKey),
		PrincipalType: "operator",
		Domain:        "editor.example.com",
	})
	require.NoError(t, err)

	g := graphFixture{
		f: f, msgServer: msgServer, q: q, key: key,
		a: hashOf("original text"),
		b: hashOf("grammar-fixed text"),
		c: hashOf("human-polished text"),
		d: hashOf("translated text"),
	}
	g.submitEdge(t, g.a, g.b, "ai_grammar")
	g.submitEdge(t, g.b, g.c, "human_edit")
	g.submitEdge(t, g.a, g.d, "translation")
	return g
}

func (g graphFixture) submitEdge(t *testing.T, in, out []byte, kind string) {
	t.Helper()
	_, err := g.msgServer.SubmitProvenanceNode(g.f.ctx, &types.MsgSubmitProvenanceNode{
		Creator:            "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		ContentHashIn:      in,
		ContentHashOut:     out,
		TransformationType: kind,
		PrincipalId:        "editor-1",
		Sig:                signNodePayload(t, g.key, in, out, kind, "editor-1"),
	})
	require.NoError(t, err)
}

func kinds(nodes []*types.ProvenanceNode) map[string]bool {
	out := map[string]bool{}
	for _, n := range nodes {
		out[n.TransformationType] = true
	}
	return out
}

// TestNodesByContent: A has two outgoing edges and none incoming; B has one of
// each; a random hash has none.
func TestNodesByContent(t *testing.T) {
	g := setupGraph(t)

	respA, err := g.q.NodesByContent(g.f.ctx, &types.QueryNodesByContentRequest{
		ContentHashHex: hex.EncodeToString(g.a),
	})
	require.NoError(t, err)
	require.Len(t, respA.AsInput, 2, "A feeds two derivations")
	require.Empty(t, respA.AsOutput, "A was not derived from anything")

	respB, err := g.q.NodesByContent(g.f.ctx, &types.QueryNodesByContentRequest{
		ContentHashHex: "0x" + hex.EncodeToString(g.b), // 0x prefix accepted
	})
	require.NoError(t, err)
	require.Len(t, respB.AsInput, 1)
	require.Len(t, respB.AsOutput, 1)
	require.Equal(t, "ai_grammar", respB.AsOutput[0].TransformationType)

	respNone, err := g.q.NodesByContent(g.f.ctx, &types.QueryNodesByContentRequest{
		ContentHashHex: hex.EncodeToString(hashOf("never seen")),
	})
	require.NoError(t, err)
	require.Empty(t, respNone.AsInput)
	require.Empty(t, respNone.AsOutput)
}

// TestLineage_AncestorsAndDescendants: C's ancestry reaches back through B to
// A; A's descendants cover the whole graph; D has exactly one ancestor edge.
func TestLineage_AncestorsAndDescendants(t *testing.T) {
	g := setupGraph(t)

	respC, err := g.q.Lineage(g.f.ctx, &types.QueryLineageRequest{
		ContentHashHex: hex.EncodeToString(g.c),
	})
	require.NoError(t, err)
	require.Len(t, respC.Ancestors, 2, "C's ancestry: A->B and B->C")
	require.Empty(t, respC.Descendants)
	require.False(t, respC.Truncated)
	require.Equal(t, map[string]bool{"ai_grammar": true, "human_edit": true}, kinds(respC.Ancestors))

	respA, err := g.q.Lineage(g.f.ctx, &types.QueryLineageRequest{
		ContentHashHex: hex.EncodeToString(g.a),
	})
	require.NoError(t, err)
	require.Empty(t, respA.Ancestors)
	require.Len(t, respA.Descendants, 3, "everything derives from A")
	require.Equal(t, map[string]bool{"ai_grammar": true, "human_edit": true, "translation": true}, kinds(respA.Descendants))

	respD, err := g.q.Lineage(g.f.ctx, &types.QueryLineageRequest{
		ContentHashHex: hex.EncodeToString(g.d),
	})
	require.NoError(t, err)
	require.Len(t, respD.Ancestors, 1)
	require.Equal(t, "translation", respD.Ancestors[0].TransformationType)
}

// TestLineage_DepthCap: depth 1 from C sees only the B->C edge and reports
// truncation because A->B lies one hop further.
func TestLineage_DepthCap(t *testing.T) {
	g := setupGraph(t)

	resp, err := g.q.Lineage(g.f.ctx, &types.QueryLineageRequest{
		ContentHashHex: hex.EncodeToString(g.c),
		MaxDepth:       1,
	})
	require.NoError(t, err)
	require.Len(t, resp.Ancestors, 1)
	require.Equal(t, "human_edit", resp.Ancestors[0].TransformationType)
	require.True(t, resp.Truncated)
}

// TestPrincipalQuery: the registered principal is queryable, domain included.
func TestPrincipalQuery(t *testing.T) {
	g := setupGraph(t)

	resp, err := g.q.Principal(g.f.ctx, &types.QueryPrincipalRequest{PrincipalId: "editor-1"})
	require.NoError(t, err)
	require.Equal(t, "editor-1", resp.Principal.PrincipalId)
	require.Equal(t, "editor.example.com", resp.Principal.Domain)

	_, err = g.q.Principal(g.f.ctx, &types.QueryPrincipalRequest{PrincipalId: "ghost"})
	require.Error(t, err)
}

// TestLineage_BadHash: junk input is rejected cleanly.
func TestLineage_BadHash(t *testing.T) {
	g := setupGraph(t)
	_, err := g.q.Lineage(g.f.ctx, &types.QueryLineageRequest{ContentHashHex: "zz"})
	require.Error(t, err)
}

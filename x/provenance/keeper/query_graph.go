package keeper

import (
	"context"
	"encoding/hex"
	"strings"

	"cosmossdk.io/collections"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/surprotocol/surchain/x/provenance/types"
)

// Walk caps: a lineage response never walks deeper than maxLineageDepth hops
// in one direction, and never returns more than maxLineageNodes edges total —
// a queried node with a pathological fan-out can't turn a REST call into a
// full-store scan.
const (
	maxLineageDepth = 16
	maxLineageNodes = 256
)

func parseContentHash(hexStr string) ([]byte, error) {
	clean := strings.TrimSpace(strings.TrimPrefix(strings.ToLower(hexStr), "0x"))
	hash, err := hex.DecodeString(clean)
	if err != nil || len(hash) != 32 {
		return nil, status.Error(codes.InvalidArgument, "content_hash_hex must be 32-byte hex")
	}
	return hash, nil
}

// Principal returns a registered pipeline principal by id.
func (q queryServer) Principal(ctx context.Context, req *types.QueryPrincipalRequest) (*types.QueryPrincipalResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	principal, err := q.k.Principals.Get(ctx, req.PrincipalId)
	if err != nil {
		return nil, status.Error(codes.NotFound, "principal not found")
	}
	return &types.QueryPrincipalResponse{Principal: principal}, nil
}

// nodesTouching returns the nodes indexed under a content hash in the given
// direction ("in" = content was the edge's input, "out" = its output).
func (q queryServer) nodesTouching(ctx context.Context, hash []byte, byIn bool) ([]*types.ProvenanceNode, error) {
	index := q.k.NodesByOut
	if byIn {
		index = q.k.NodesByIn
	}
	var nodes []*types.ProvenanceNode
	rng := collections.NewPrefixedPairRange[[]byte, string](hash)
	err := index.Walk(ctx, rng, func(key collections.Pair[[]byte, string]) (bool, error) {
		node, err := q.k.ProvenanceNodes.Get(ctx, key.K2())
		if err != nil {
			return false, nil // index newer than node store — skip, don't fail
		}
		nodes = append(nodes, &node)
		return false, nil
	})
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	return nodes, nil
}

// NodesByContent lists every provenance edge touching the given content hash.
func (q queryServer) NodesByContent(ctx context.Context, req *types.QueryNodesByContentRequest) (*types.QueryNodesByContentResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	hash, err := parseContentHash(req.ContentHashHex)
	if err != nil {
		return nil, err
	}
	asInput, err := q.nodesTouching(ctx, hash, true)
	if err != nil {
		return nil, err
	}
	asOutput, err := q.nodesTouching(ctx, hash, false)
	if err != nil {
		return nil, err
	}
	return &types.QueryNodesByContentResponse{AsInput: asInput, AsOutput: asOutput}, nil
}

// walkLineage does a breadth-first walk from `start` in one direction.
// Ancestors: follow edges where the frontier hash is the OUTPUT, stepping to
// each edge's input. Descendants: follow edges where it is the INPUT, stepping
// to each edge's output.
func (q queryServer) walkLineage(ctx context.Context, start []byte, maxDepth uint32, ancestors bool) ([]*types.ProvenanceNode, bool, error) {
	var edges []*types.ProvenanceNode
	seenEdges := map[string]bool{}
	seenHashes := map[string]bool{string(start): true}
	frontier := [][]byte{start}
	truncated := false

	for depth := uint32(0); depth < maxDepth && len(frontier) > 0; depth++ {
		var next [][]byte
		for _, hash := range frontier {
			// ancestors ⇒ this hash was an edge's output; descendants ⇒ input
			nodes, err := q.nodesTouching(ctx, hash, !ancestors)
			if err != nil {
				return nil, false, err
			}
			for _, node := range nodes {
				if seenEdges[node.NodeId] {
					continue
				}
				if len(edges) >= maxLineageNodes {
					truncated = true
					return edges, truncated, nil
				}
				seenEdges[node.NodeId] = true
				edges = append(edges, node)

				step := node.ContentHashIn
				if !ancestors {
					step = node.ContentHashOut
				}
				if !seenHashes[string(step)] {
					seenHashes[string(step)] = true
					next = append(next, step)
				}
			}
		}
		if depth == maxDepth-1 && len(next) > 0 {
			truncated = true
		}
		frontier = next
	}
	return edges, truncated, nil
}

// Lineage returns the provenance subgraph reachable from a content hash.
func (q queryServer) Lineage(ctx context.Context, req *types.QueryLineageRequest) (*types.QueryLineageResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	hash, err := parseContentHash(req.ContentHashHex)
	if err != nil {
		return nil, err
	}
	depth := req.MaxDepth
	if depth == 0 || depth > maxLineageDepth {
		depth = maxLineageDepth
	}

	ancestors, ancTruncated, err := q.walkLineage(ctx, hash, depth, true)
	if err != nil {
		return nil, err
	}
	descendants, descTruncated, err := q.walkLineage(ctx, hash, depth, false)
	if err != nil {
		return nil, err
	}
	return &types.QueryLineageResponse{
		Ancestors:   ancestors,
		Descendants: descendants,
		Truncated:   ancTruncated || descTruncated,
	}, nil
}

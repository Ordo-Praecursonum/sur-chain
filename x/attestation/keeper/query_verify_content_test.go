package keeper_test

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/surprotocol/surchain/x/attestation/keeper"
	"github.com/surprotocol/surchain/x/attestation/types"
)

// TestVerifyContent_FoundAfterSubmit is the provenance-verification completeness
// test: once a real attestation lands, looking it up by content hash returns the
// matching record.
func TestVerifyContent_FoundAfterSubmit(t *testing.T) {
	f := initFixture(t)
	fx := loadFixture(t)
	msg := fx.msg(t)
	f.identityKeeper.addProfileWithRoot(fx.Username, msg.CommitmentRoot)

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	q := keeper.NewQueryServerImpl(f.keeper)
	resp, err := q.VerifyContent(f.ctx, &types.QueryVerifyContentRequest{
		ContentHashHex: fx.ContentHashHex,
	})
	require.NoError(t, err)
	require.True(t, resp.Found)
	require.Len(t, resp.Attestations, 1)
	require.Equal(t, fx.Username, resp.Attestations[0].Username)
	require.Equal(t, msg.Nullifier, resp.Attestations[0].Nullifier)
	require.Equal(t, msg.CommitmentRoot, resp.Attestations[0].CommitmentRoot)

	// A 0x prefix and uppercase must resolve to the same content.
	resp2, err := q.VerifyContent(f.ctx, &types.QueryVerifyContentRequest{
		ContentHashHex: "0x" + strings.ToUpper(strings.TrimPrefix(fx.ContentHashHex, "0x")),
	})
	require.NoError(t, err)
	require.True(t, resp2.Found)
}

// TestVerifyContent_NotFound: content never attested has unverified origin.
func TestVerifyContent_NotFound(t *testing.T) {
	f := initFixture(t)
	q := keeper.NewQueryServerImpl(f.keeper)

	// 32-byte hash that was never attested.
	resp, err := q.VerifyContent(f.ctx, &types.QueryVerifyContentRequest{
		ContentHashHex: strings.Repeat("ab", 32),
	})
	require.NoError(t, err)
	require.False(t, resp.Found)
	require.Empty(t, resp.Attestations)
}

// TestVerifyContent_BadInput: non-hex / wrong-length input is rejected.
func TestVerifyContent_BadInput(t *testing.T) {
	f := initFixture(t)
	q := keeper.NewQueryServerImpl(f.keeper)

	_, err := q.VerifyContent(f.ctx, &types.QueryVerifyContentRequest{ContentHashHex: "nothex"})
	require.Error(t, err)

	_, err = q.VerifyContent(f.ctx, &types.QueryVerifyContentRequest{ContentHashHex: "abcd"})
	require.Error(t, err) // only 2 bytes
}

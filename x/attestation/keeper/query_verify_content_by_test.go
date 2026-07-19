package keeper_test

import (
	"encoding/hex"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/surprotocol/surchain/x/attestation/keeper"
	"github.com/surprotocol/surchain/x/attestation/types"
)

// TestVerifyContentBy_DeviceID: the scoped lookup finds an attestation when
// queried with the exact (content hash, device id) pair it was submitted under.
func TestVerifyContentBy_DeviceID(t *testing.T) {
	f := initFixture(t)
	msg, _, deviceID := makeDeviceDeclaration(t, "device_authored", "")
	f.identityKeeper.addProfile(deviceID)

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	q := keeper.NewQueryServerImpl(f.keeper)
	resp, err := q.VerifyContentBy(f.ctx, &types.QueryVerifyContentByRequest{
		ContentHashHex: hex.EncodeToString(msg.ContentHash),
		Identifier:     deviceID,
	})
	require.NoError(t, err)
	require.True(t, resp.Found)
	require.Equal(t, deviceID, resp.Identifier)
	require.Len(t, resp.Attestations, 1)
	require.Equal(t, deviceID, resp.Attestations[0].Username)
	require.Equal(t, "device_authored", resp.Attestations[0].Origin)
}

// TestVerifyContentBy_Pubkey: passing the hex compressed public key instead of
// the bech32 id resolves to the same device and finds the same attestation.
func TestVerifyContentBy_Pubkey(t *testing.T) {
	f := initFixture(t)
	msg, priv, deviceID := makeDeviceDeclaration(t, "device_authored", "")
	f.identityKeeper.addProfile(deviceID)

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	q := keeper.NewQueryServerImpl(f.keeper)
	pubHex := hex.EncodeToString(priv.PubKey().Bytes())
	resp, err := q.VerifyContentBy(f.ctx, &types.QueryVerifyContentByRequest{
		ContentHashHex: hex.EncodeToString(msg.ContentHash),
		Identifier:     "0x" + strings.ToUpper(pubHex), // prefix + case must not matter
	})
	require.NoError(t, err)
	require.True(t, resp.Found)
	require.Equal(t, deviceID, resp.Identifier)
	require.Len(t, resp.Attestations, 1)
}

// TestVerifyContentBy_WrongIdentity: right content, different identity → not
// found (and no leakage of the other identity's attestations).
func TestVerifyContentBy_WrongIdentity(t *testing.T) {
	f := initFixture(t)
	msg, _, deviceID := makeDeviceDeclaration(t, "device_authored", "")
	f.identityKeeper.addProfile(deviceID)

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	// A different, never-seen device id (built from a fresh key).
	otherMsg, _, otherID := makeDeviceDeclaration(t, "device_authored", "")
	_ = otherMsg
	require.NotEqual(t, deviceID, otherID)

	q := keeper.NewQueryServerImpl(f.keeper)
	resp, err := q.VerifyContentBy(f.ctx, &types.QueryVerifyContentByRequest{
		ContentHashHex: hex.EncodeToString(msg.ContentHash),
		Identifier:     otherID,
	})
	require.NoError(t, err)
	require.False(t, resp.Found)
	require.Empty(t, resp.Attestations)
}

// TestVerifyContentBy_HumanTyping: the scoped lookup also works for the
// ZK-proven human-typing path (the fixture attestation).
func TestVerifyContentBy_HumanTyping(t *testing.T) {
	f := initFixture(t)
	fx := loadFixture(t)
	msg := fx.msg(t)
	f.identityKeeper.addProfileWithRoot(fx.Username, msg.CommitmentRoot)

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	q := keeper.NewQueryServerImpl(f.keeper)
	resp, err := q.VerifyContentBy(f.ctx, &types.QueryVerifyContentByRequest{
		ContentHashHex: fx.ContentHashHex,
		Identifier:     fx.Username,
	})
	require.NoError(t, err)
	require.True(t, resp.Found)
	require.Len(t, resp.Attestations, 1)
	require.Equal(t, fx.Username, resp.Attestations[0].Username)
}

// TestVerifyContentBy_BadIdentifier: an empty identifier errors; junk
// identifiers are matched literally and simply return found=false.
func TestVerifyContentBy_BadIdentifier(t *testing.T) {
	f := initFixture(t)
	q := keeper.NewQueryServerImpl(f.keeper)

	_, err := q.VerifyContentBy(f.ctx, &types.QueryVerifyContentByRequest{
		ContentHashHex: strings.Repeat("ab", 32),
		Identifier:     "   ",
	})
	require.Error(t, err, "empty identifier should be rejected")

	for _, junk := range []string{"not-an-id", "0x1234"} {
		resp, err := q.VerifyContentBy(f.ctx, &types.QueryVerifyContentByRequest{
			ContentHashHex: strings.Repeat("ab", 32),
			Identifier:     junk,
		})
		require.NoError(t, err)
		require.False(t, resp.Found, "junk identifier %q should just not match", junk)
	}
}

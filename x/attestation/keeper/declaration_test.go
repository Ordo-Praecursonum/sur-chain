package keeper_test

import (
	"crypto/sha256"
	"encoding/hex"
	"testing"

	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	"github.com/cosmos/cosmos-sdk/types/bech32"
	"github.com/stretchr/testify/require"

	"github.com/surprotocol/surchain/x/attestation/keeper"
	"github.com/surprotocol/surchain/x/attestation/types"
)

// makeDeviceDeclaration builds a device-signed declaration the way the iOS app
// does: device id = bech32("surdev", address(pubkey)); signature over
// SHA-256(content_hash ‖ origin ‖ citation ‖ nullifier).
func makeDeviceDeclaration(t *testing.T, origin, citation string) (*types.MsgSubmitAttestation, *secp256k1.PrivKey, string) {
	t.Helper()
	priv := secp256k1.GenPrivKey()
	pub := priv.PubKey()
	deviceID, err := bech32.ConvertAndEncode("surdev", pub.Address().Bytes())
	require.NoError(t, err)

	contentHash := sha256.Sum256([]byte("typed-or-pasted content " + origin))
	nullifier := sha256.Sum256([]byte("nullifier " + origin + citation))

	payload := append([]byte{}, contentHash[:]...)
	payload = append(payload, []byte(origin)...)
	payload = append(payload, []byte(citation)...)
	payload = append(payload, nullifier[:]...)
	sig, err := priv.Sign(payload) // hashes SHA-256 internally, like iOS signMessage
	require.NoError(t, err)

	msg := &types.MsgSubmitAttestation{
		Creator:         fixtureCreator,
		Username:        deviceID,
		ContentHash:     contentHash[:],
		Nullifier:       nullifier[:],
		Origin:          origin,
		Citation:        citation,
		DevicePubkey:    pub.Bytes(),
		DeviceSignature: sig,
	}
	return msg, priv, deviceID
}

// TestSubmitDeclaration_Success: a device-signed declaration (no ZK proof) is
// accepted and stored with its origin + citation, and is queryable by content.
func TestSubmitDeclaration_Success(t *testing.T) {
	f := initFixture(t)
	msg, _, deviceID := makeDeviceDeclaration(t, "external_source", "https://example.com/article")
	f.identityKeeper.addProfile(deviceID)

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	q := keeper.NewQueryServerImpl(f.keeper)
	resp, err := q.VerifyContent(f.ctx, &types.QueryVerifyContentRequest{
		ContentHashHex: hex.EncodeToString(msg.ContentHash),
	})
	require.NoError(t, err)
	require.True(t, resp.Found)
	require.Len(t, resp.Attestations, 1)
	require.Equal(t, "external_source", resp.Attestations[0].Origin)
	require.Equal(t, "https://example.com/article", resp.Attestations[0].Citation)
	require.Equal(t, deviceID, resp.Attestations[0].Username)
}

// TestSubmitDeclaration_TamperedSignature: a bad signature is rejected.
func TestSubmitDeclaration_TamperedSignature(t *testing.T) {
	f := initFixture(t)
	msg, _, deviceID := makeDeviceDeclaration(t, "ai_generated", "")
	f.identityKeeper.addProfile(deviceID)
	msg.DeviceSignature[0] ^= 0xff

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "declaration verification failed")
}

// TestSubmitDeclaration_PubkeyMismatch: a pubkey that doesn't hash to the device
// id is rejected (can't declare "as" another device).
func TestSubmitDeclaration_PubkeyMismatch(t *testing.T) {
	f := initFixture(t)
	msg, _, deviceID := makeDeviceDeclaration(t, "device_authored", "")
	f.identityKeeper.addProfile(deviceID)
	// Replace the pubkey with a different valid key.
	other := secp256k1.GenPrivKey().PubKey()
	msg.DevicePubkey = other.Bytes()

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
}

// TestSubmitAIAgent_SelfSovereign: an AI agent (surai1… address) attests without
// any registered profile — its identity is its own key. The signature must verify.
func TestSubmitAIAgent_SelfSovereign(t *testing.T) {
	f := initFixture(t)

	priv := secp256k1.GenPrivKey()
	pub := priv.PubKey()
	agentID, err := bech32.ConvertAndEncode("surai", pub.Address().Bytes())
	require.NoError(t, err)

	contentHash := sha256.Sum256([]byte("output produced by an AI agent"))
	nullifier := sha256.Sum256([]byte("agent-nullifier-1"))
	origin := "ai_agent"
	payload := append([]byte{}, contentHash[:]...)
	payload = append(payload, []byte(origin)...)
	payload = append(payload, []byte("")...) // empty citation
	payload = append(payload, nullifier[:]...)
	sig, err := priv.Sign(payload)
	require.NoError(t, err)

	msg := &types.MsgSubmitAttestation{
		Creator:         fixtureCreator, // the owner account = tx signer (public ownership)
		Username:        agentID,
		ContentHash:     contentHash[:],
		Nullifier:       nullifier[:],
		Origin:          origin,
		DevicePubkey:    pub.Bytes(),
		DeviceSignature: sig,
	}

	// No addProfile(agentID) — agent is self-sovereign.
	_, err = keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	q := keeper.NewQueryServerImpl(f.keeper)
	resp, err := q.VerifyContent(f.ctx, &types.QueryVerifyContentRequest{
		ContentHashHex: hex.EncodeToString(contentHash[:]),
	})
	require.NoError(t, err)
	require.True(t, resp.Found)
	require.Equal(t, "ai_agent", resp.Attestations[0].Origin)
	require.Equal(t, agentID, resp.Attestations[0].Username)
}

// TestSubmitDeclaration_UnknownOrigin: an unrecognized origin is rejected.
func TestSubmitDeclaration_UnknownOrigin(t *testing.T) {
	f := initFixture(t)
	msg, _, deviceID := makeDeviceDeclaration(t, "device_authored", "")
	f.identityKeeper.addProfile(deviceID)
	msg.Origin = "totally_made_up"

	_, err := keeper.NewMsgServerImpl(f.keeper).SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
}

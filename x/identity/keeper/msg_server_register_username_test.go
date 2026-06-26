package keeper_test

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/surprotocol/surchain/x/identity/keeper"
	"github.com/surprotocol/surchain/x/identity/types"
)

// generateTestKey returns a P-256 private key for testing.
func generateTestKey(t *testing.T) *ecdsa.PrivateKey {
	t.Helper()
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	require.NoError(t, err)
	return key
}

// pubkeyBytes converts an ecdsa.PublicKey to uncompressed 65-byte representation.
func pubkeyBytes(pub *ecdsa.PublicKey) []byte {
	b := make([]byte, 65)
	b[0] = 0x04
	xBytes := pub.X.Bytes()
	yBytes := pub.Y.Bytes()
	copy(b[1+32-len(xBytes):33], xBytes)
	copy(b[33+32-len(yBytes):65], yBytes)
	return b
}

// signPayload signs payload with the private key using ASN.1 DER ECDSA.
func signPayload(t *testing.T, key *ecdsa.PrivateKey, payload []byte) []byte {
	t.Helper()
	hash := sha256.Sum256(payload)
	sig, err := ecdsa.SignASN1(rand.Reader, key, hash[:])
	require.NoError(t, err)
	return sig
}

func TestRegisterUsername_Success(t *testing.T) {
	f := initFixture(t)

	key := generateTestKey(t)
	pubkey := pubkeyBytes(&key.PublicKey)
	commitment := make([]byte, 32)
	commitment[0] = 0x01 // non-zero

	payload := []byte("test-payload-for-registration")
	sig := signPayload(t, key, payload)

	msg := &types.MsgRegisterUsername{
		Creator:         "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		Username:        "alice",
		ControlPubkey:   pubkey,
		FirstCommitment: commitment,
		IdentitySig:     sig,
		Payload:         payload,
	}

	msgServer := newMsgServer(f)
	resp, err := msgServer.RegisterUsername(f.ctx, msg)
	require.NoError(t, err)
	require.NotNil(t, resp)

	// Verify profile was stored
	profile, err := f.keeper.UserProfiles.Get(f.ctx, "alice")
	require.NoError(t, err)
	require.Equal(t, "alice", profile.Username)
	require.Equal(t, uint64(1), profile.DeviceCount)
	require.Equal(t, uint64(1), profile.TotalDeviceCount)

	// The commitment root is now the depth-8 Poseidon Merkle root over the
	// device set (matching the attestation circuit), NOT the raw first commitment.
	expectedRoot, err := keeper.ComputeCommitmentRoot(map[uint64][]byte{0: commitment})
	require.NoError(t, err)
	require.Equal(t, expectedRoot, profile.CommitmentRoot)
	require.NotEqual(t, commitment, profile.CommitmentRoot)
	require.Len(t, profile.CommitmentRoot, 32)
}

func TestRegisterUsername_DuplicateUsername(t *testing.T) {
	f := initFixture(t)

	key := generateTestKey(t)
	pubkey := pubkeyBytes(&key.PublicKey)
	commitment := make([]byte, 32)
	commitment[0] = 0x01

	payload := []byte("test-payload")
	sig := signPayload(t, key, payload)

	msg := &types.MsgRegisterUsername{
		Creator:         "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		Username:        "alice",
		ControlPubkey:   pubkey,
		FirstCommitment: commitment,
		IdentitySig:     sig,
		Payload:         payload,
	}

	msgServer := newMsgServer(f)

	// First registration should succeed
	_, err := msgServer.RegisterUsername(f.ctx, msg)
	require.NoError(t, err)

	// Second registration with the same username should fail
	_, err = msgServer.RegisterUsername(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "already registered")
}

func TestRegisterUsername_InvalidUsernameFormat(t *testing.T) {
	f := initFixture(t)
	msgServer := newMsgServer(f)

	key := generateTestKey(t)
	pubkey := pubkeyBytes(&key.PublicKey)
	commitment := make([]byte, 32)
	commitment[0] = 0x01
	payload := []byte("payload")
	sig := signPayload(t, key, payload)

	invalidUsernames := []string{
		"AB",          // too short
		"ab",          // too short (2 chars)
		"UPPERCASE",   // uppercase not allowed
		"has space",   // space not allowed
		"has@special", // @ not allowed
	}

	for _, username := range invalidUsernames {
		msg := &types.MsgRegisterUsername{
			Creator:         "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
			Username:        username,
			ControlPubkey:   pubkey,
			FirstCommitment: commitment,
			IdentitySig:     sig,
			Payload:         payload,
		}
		_, err := msgServer.RegisterUsername(f.ctx, msg)
		require.Error(t, err, "expected error for username: %q", username)
	}
}

func TestRegisterUsername_InvalidSignature(t *testing.T) {
	f := initFixture(t)
	msgServer := newMsgServer(f)

	key := generateTestKey(t)
	pubkey := pubkeyBytes(&key.PublicKey)
	commitment := make([]byte, 32)
	commitment[0] = 0x01

	msg := &types.MsgRegisterUsername{
		Creator:         "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		Username:        "alice",
		ControlPubkey:   pubkey,
		FirstCommitment: commitment,
		IdentitySig:     []byte("invalid-signature"),
		Payload:         []byte("payload"),
	}

	_, err := msgServer.RegisterUsername(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "signature")
}

// newMsgServer creates a new msgServer wrapping the keeper.
func newMsgServer(f *fixture) types.MsgServer {
	return keeper.NewMsgServerImpl(f.keeper)
}

package keeper_test

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/surprotocol/surchain/x/provenance/keeper"
	"github.com/surprotocol/surchain/x/provenance/types"
)

func generateTestKey(t *testing.T) *ecdsa.PrivateKey {
	t.Helper()
	key, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	require.NoError(t, err)
	return key
}

func pubkeyBytes(pub *ecdsa.PublicKey) []byte {
	b := make([]byte, 65)
	b[0] = 0x04
	xBytes := pub.X.Bytes()
	yBytes := pub.Y.Bytes()
	copy(b[1+32-len(xBytes):33], xBytes)
	copy(b[33+32-len(yBytes):65], yBytes)
	return b
}

func signNodePayload(t *testing.T, key *ecdsa.PrivateKey, hashIn, hashOut []byte, transformType, principalID string) []byte {
	t.Helper()
	h := sha256.New()
	h.Write(hashIn)
	h.Write(hashOut)
	h.Write([]byte(transformType))
	h.Write([]byte(principalID))
	payloadHash := h.Sum(nil)
	sig, err := ecdsa.SignASN1(rand.Reader, key, payloadHash)
	require.NoError(t, err)
	return sig
}

func TestRegisterPrincipal_Success(t *testing.T) {
	f := initFixture(t)
	msgServer := keeper.NewMsgServerImpl(f.keeper)

	key := generateTestKey(t)
	pubkey := pubkeyBytes(&key.PublicKey)

	msg := &types.MsgRegisterPrincipal{
		Creator:       "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		PrincipalId:   "pipeline-operator-1",
		Name:          "Test Pipeline Operator",
		Pubkey:        pubkey,
		PrincipalType: "operator",
	}

	resp, err := msgServer.RegisterPrincipal(f.ctx, msg)
	require.NoError(t, err)
	require.NotNil(t, resp)

	// Verify principal was stored
	principal, err := f.keeper.Principals.Get(f.ctx, "pipeline-operator-1")
	require.NoError(t, err)
	require.Equal(t, "pipeline-operator-1", principal.PrincipalId)
	require.Equal(t, "Test Pipeline Operator", principal.Name)
}

func TestRegisterPrincipal_DuplicateId(t *testing.T) {
	f := initFixture(t)
	msgServer := keeper.NewMsgServerImpl(f.keeper)

	key := generateTestKey(t)
	pubkey := pubkeyBytes(&key.PublicKey)

	msg := &types.MsgRegisterPrincipal{
		Creator:       "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		PrincipalId:   "pipeline-operator-1",
		Name:          "Operator",
		Pubkey:        pubkey,
		PrincipalType: "operator",
	}

	// First registration should succeed
	_, err := msgServer.RegisterPrincipal(f.ctx, msg)
	require.NoError(t, err)

	// Second registration should fail
	_, err = msgServer.RegisterPrincipal(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "already registered")
}

func TestSubmitProvenanceNode_Success(t *testing.T) {
	f := initFixture(t)
	msgServer := keeper.NewMsgServerImpl(f.keeper)

	key := generateTestKey(t)
	pubkey := pubkeyBytes(&key.PublicKey)

	// Register principal first
	regMsg := &types.MsgRegisterPrincipal{
		Creator:       "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		PrincipalId:   "op-1",
		Name:          "Operator",
		Pubkey:        pubkey,
		PrincipalType: "operator",
	}
	_, err := msgServer.RegisterPrincipal(f.ctx, regMsg)
	require.NoError(t, err)

	hashIn := make([]byte, 32)
	hashIn[0] = 0x01
	hashOut := make([]byte, 32)
	hashOut[0] = 0x02
	transformType := "summarize"

	sig := signNodePayload(t, key, hashIn, hashOut, transformType, "op-1")

	nodeMsg := &types.MsgSubmitProvenanceNode{
		Creator:            "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		ContentHashIn:      hashIn,
		ContentHashOut:     hashOut,
		TransformationType: transformType,
		PrincipalId:        "op-1",
		Sig:                sig,
	}

	resp, err := msgServer.SubmitProvenanceNode(f.ctx, nodeMsg)
	require.NoError(t, err)
	require.NotNil(t, resp)
}

func TestSubmitProvenanceNode_PrincipalNotFound(t *testing.T) {
	f := initFixture(t)
	msgServer := keeper.NewMsgServerImpl(f.keeper)

	hashIn := make([]byte, 32)
	hashIn[0] = 0x01
	hashOut := make([]byte, 32)
	hashOut[0] = 0x02

	msg := &types.MsgSubmitProvenanceNode{
		Creator:            "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p",
		ContentHashIn:      hashIn,
		ContentHashOut:     hashOut,
		TransformationType: "summarize",
		PrincipalId:        "nonexistent",
		Sig:                []byte("invalid-sig"),
	}

	_, err := msgServer.SubmitProvenanceNode(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "not found")
}

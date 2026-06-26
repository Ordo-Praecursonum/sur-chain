package keeper_test

import (
	"encoding/hex"
	"encoding/json"
	"os"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/surprotocol/surchain/x/attestation/keeper"
	"github.com/surprotocol/surchain/x/attestation/types"
)

const fixtureCreator = "sur1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5wqs9p"

// attestationFixture is a real Groth16 proof produced by the surcorelibs prover
// via `go run ./cmd/genfixture`. It is the cross-module completeness/soundness
// anchor: the chain reconstructs the public inputs from these fields and the
// proof must verify against the embedded verifying key.
type attestationFixture struct {
	Username       string `json:"username"`
	ContentHashHex string `json:"content_hash"`
	NullifierHex   string `json:"nullifier"`
	CommitmentRoot string `json:"commitment_root"`
	ProofHex       string `json:"proof_bytes"`
}

func loadFixture(t *testing.T) attestationFixture {
	t.Helper()
	b, err := os.ReadFile("testdata/attestation_fixture.json")
	require.NoError(t, err, "missing fixture; regenerate with `go run ./cmd/genfixture` in surcorelibs")
	var fx attestationFixture
	require.NoError(t, json.Unmarshal(b, &fx))
	return fx
}

func mustHex(t *testing.T, s string) []byte {
	t.Helper()
	b, err := hex.DecodeString(strings.TrimPrefix(s, "0x"))
	require.NoError(t, err)
	return b
}

func (fx attestationFixture) msg(t *testing.T) *types.MsgSubmitAttestation {
	t.Helper()
	return &types.MsgSubmitAttestation{
		Creator:        fixtureCreator,
		Username:       fx.Username,
		ContentHash:    mustHex(t, fx.ContentHashHex),
		Nullifier:      mustHex(t, fx.NullifierHex),
		CommitmentRoot: mustHex(t, fx.CommitmentRoot),
		ProofBytes:     mustHex(t, fx.ProofHex),
	}
}

// TestSubmitAttestation_Success is the COMPLETENESS test at the chain layer: a
// real proof, with the user registered at the matching commitment root, verifies
// and is recorded.
func TestSubmitAttestation_Success(t *testing.T) {
	f := initFixture(t)
	fx := loadFixture(t)
	msg := fx.msg(t)
	f.identityKeeper.addProfileWithRoot(fx.Username, msg.CommitmentRoot)

	msgServer := keeper.NewMsgServerImpl(f.keeper)
	resp, err := msgServer.SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)
	require.NotNil(t, resp)

	used, err := f.keeper.Nullifiers.Get(f.ctx, msg.Nullifier)
	require.NoError(t, err)
	require.True(t, used)
}

// TestSubmitAttestation_TamperedProof is a SOUNDNESS test: flipping a proof byte
// must cause verification to fail.
func TestSubmitAttestation_TamperedProof(t *testing.T) {
	f := initFixture(t)
	fx := loadFixture(t)
	msg := fx.msg(t)
	f.identityKeeper.addProfileWithRoot(fx.Username, msg.CommitmentRoot)
	msg.ProofBytes[0] ^= 0xff // corrupt

	msgServer := keeper.NewMsgServerImpl(f.keeper)
	_, err := msgServer.SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "proof")
}

// TestSubmitAttestation_TamperedNullifier is a SOUNDNESS test: a nullifier that
// was not the one proven must fail verification (it is a public input).
func TestSubmitAttestation_TamperedNullifier(t *testing.T) {
	f := initFixture(t)
	fx := loadFixture(t)
	msg := fx.msg(t)
	f.identityKeeper.addProfileWithRoot(fx.Username, msg.CommitmentRoot)
	msg.Nullifier[31] ^= 0x01 // different nullifier than was proven

	msgServer := keeper.NewMsgServerImpl(f.keeper)
	_, err := msgServer.SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
}

// TestSubmitAttestation_WrongCommitmentRoot is a SOUNDNESS test: a commitment
// root that does not match the user's registered root is rejected before
// verification.
func TestSubmitAttestation_WrongCommitmentRoot(t *testing.T) {
	f := initFixture(t)
	fx := loadFixture(t)
	msg := fx.msg(t)

	otherRoot := make([]byte, 32)
	otherRoot[0] = 0xaa
	f.identityKeeper.addProfileWithRoot(fx.Username, otherRoot)

	msgServer := keeper.NewMsgServerImpl(f.keeper)
	_, err := msgServer.SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "commitment root")
}

// TestSubmitAttestation_NullifierReplay is a SOUNDNESS test: the same proof
// cannot be submitted twice.
func TestSubmitAttestation_NullifierReplay(t *testing.T) {
	f := initFixture(t)
	fx := loadFixture(t)
	msg := fx.msg(t)
	f.identityKeeper.addProfileWithRoot(fx.Username, msg.CommitmentRoot)

	msgServer := keeper.NewMsgServerImpl(f.keeper)

	_, err := msgServer.SubmitAttestation(f.ctx, msg)
	require.NoError(t, err)

	_, err = msgServer.SubmitAttestation(f.ctx, fx.msg(t))
	require.Error(t, err)
	require.Contains(t, err.Error(), "already been used")
}

func TestSubmitAttestation_UsernameNotFound(t *testing.T) {
	f := initFixture(t)

	msg := &types.MsgSubmitAttestation{
		Creator:        fixtureCreator,
		Username:       "nonexistent",
		ContentHash:    make([]byte, 32),
		Nullifier:      make([]byte, 32),
		CommitmentRoot: make([]byte, 32),
		ProofBytes:     make([]byte, 256),
	}
	msg.ContentHash[0] = 0x01
	msg.Nullifier[0] = 0x02

	msgServer := keeper.NewMsgServerImpl(f.keeper)
	_, err := msgServer.SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "not found")
}

func TestSubmitAttestation_InvalidContentHash(t *testing.T) {
	f := initFixture(t)
	f.identityKeeper.addProfile("alice")

	msg := &types.MsgSubmitAttestation{
		Creator:        fixtureCreator,
		Username:       "alice",
		ContentHash:    []byte("too-short"),
		Nullifier:      make([]byte, 32),
		CommitmentRoot: make([]byte, 32),
		ProofBytes:     make([]byte, 256),
	}
	msg.Nullifier[0] = 0x01

	msgServer := keeper.NewMsgServerImpl(f.keeper)
	_, err := msgServer.SubmitAttestation(f.ctx, msg)
	require.Error(t, err)
	require.Contains(t, err.Error(), "32 bytes")
}

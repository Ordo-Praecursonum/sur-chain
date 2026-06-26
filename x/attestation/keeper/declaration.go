package keeper

import (
	"bytes"
	"fmt"

	"github.com/cosmos/cosmos-sdk/crypto/keys/secp256k1"
	"github.com/cosmos/cosmos-sdk/types/bech32"

	"github.com/surprotocol/surchain/x/attestation/types"
)

// Provenance classes. An empty origin is treated as humanKeyboard for backward
// compatibility with proofs submitted before origins existed.
const (
	originHumanKeyboard  = "human_keyboard"
	originDeviceAuthored = "device_authored"
	originAIGenerated    = "ai_generated"
	originExternalSource = "external_source"
	originImported       = "imported"
	// originAIAgent is content produced by an autonomous AI agent that signs with
	// its own key. Self-sovereign: the agent identity IS its key (no registration),
	// so it is exempt from the user-profile requirement. The owner is the tx signer.
	originAIAgent = "ai_agent"

	deviceIDHRP = "surdev"
	agentIDHRP  = "surai"
)

// isDeclarationOrigin reports whether the origin is a signed declaration
// (i.e. NOT a human-typing keyboard attestation).
func isDeclarationOrigin(origin string) bool {
	switch origin {
	case originDeviceAuthored, originAIGenerated, originExternalSource, originImported, originAIAgent:
		return true
	default:
		return false
	}
}

// isSelfSovereignOrigin reports whether the origin's identity is its own key and
// therefore needs no registered user profile (currently just AI agents).
func isSelfSovereignOrigin(origin string) bool {
	return origin == originAIAgent
}

// verifyDeclaration validates a non-keyboard, device-signed attestation:
//   - the device public key hashes to the device id in msg.Username (surdev1…), and
//   - the device signature verifies over SHA-256(content_hash ‖ origin ‖ citation ‖ nullifier).
//
// It does NOT assert human typing — it only proves the named device made this
// declaration about the content.
func verifyDeclaration(msg *types.MsgSubmitAttestation, origin string) error {
	if len(msg.DevicePubkey) != 33 {
		return fmt.Errorf("device_pubkey must be a 33-byte compressed secp256k1 key")
	}
	if len(msg.DeviceSignature) != 64 {
		return fmt.Errorf("device_signature must be 64 bytes")
	}

	// The signer's public key must hash to the id in `username` — a device id
	// (surdev1…) or, for AI agents, an agent id (surai1…).
	hrp, addr, err := bech32.DecodeAndConvert(msg.Username)
	if err != nil || (hrp != deviceIDHRP && hrp != agentIDHRP) {
		return fmt.Errorf("username is not a %s/%s id", deviceIDHRP, agentIDHRP)
	}
	pub := &secp256k1.PubKey{Key: msg.DevicePubkey}
	if !bytes.Equal(pub.Address().Bytes(), addr) {
		return fmt.Errorf("device public key does not match the device id")
	}

	// Verify the device signed this exact declaration. VerifySignature hashes the
	// message with SHA-256 internally, matching the device's signMessage.
	payload := make([]byte, 0, len(msg.ContentHash)+len(origin)+len(msg.Citation)+len(msg.Nullifier))
	payload = append(payload, msg.ContentHash...)
	payload = append(payload, []byte(origin)...)
	payload = append(payload, []byte(msg.Citation)...)
	payload = append(payload, msg.Nullifier...)
	if !pub.VerifySignature(payload, msg.DeviceSignature) {
		return fmt.Errorf("device signature verification failed")
	}
	return nil
}

# AI Agent Attestation (origin `ai_agent`)

An autonomous AI agent can attest content it produced, tagged with **its own
address**. This is the "endpoint that accepts data coming from AI and tags it as
coming from a specific address."

## Identity model (phase 1: self-sovereign)

- An agent **is** a secp256k1 keypair. No registration ceremony.
- **Agent address** = `bech32("surai", ripemd160(sha256(compressed_pubkey)))` →
  `surai1…`. The `surai` prefix makes AI agents visibly distinct from devices
  (`surdev1…`) and human-typing identities.
- **Public ownership** comes from the transaction signer: the agent key signs the
  *content*, while the **owner's account signs + pays the tx**, so the chain
  publicly records which account submitted (operates) the agent. No extra field.
- Phase 2 (later): optional on-chain agent **registration** (human label + bound
  owner) layered on top.

## Submitting an attestation

Build and broadcast a normal `MsgSubmitAttestation` with `origin = "ai_agent"`.
The `device_pubkey` / `device_signature` fields carry the **agent's** key/signature.

```
content_hash = SHA-256(content)                       # 32 bytes
nullifier    = SHA-256(agent_addr || content_hash || counter)   # 32 bytes, unique
payload      = content_hash || "ai_agent" || citation || nullifier
signature    = secp256k1_sign(agent_key, payload)     # ECDSA over SHA-256(payload),
                                                      # 64-byte compact R||S, low-S

MsgSubmitAttestation{
  creator:          <owner account, e.g. sur1…>,   # signs + pays the tx (public owner)
  username:         <agent address, surai1…>,
  content_hash:     content_hash,
  nullifier:        nullifier,
  origin:           "ai_agent",
  citation:         "<optional: model name, prompt id, run url, …>",
  device_pubkey:    <agent 33-byte compressed secp256k1 pubkey>,
  device_signature: signature,
}
```

Broadcast via the standard tx endpoint
(`POST /cosmos/tx/v1beta1/txs`, `BROADCAST_MODE_SYNC`).

### What the chain verifies

1. `device_pubkey` is a 33-byte compressed secp256k1 key.
2. It hashes to the agent address in `username` (`pubkey.Address()` == bech32 bytes).
3. `device_signature` verifies over `SHA-256(content_hash‖origin‖citation‖nullifier)`
   (cosmos `secp256k1.PubKey.VerifySignature`, which SHA-256s internally).
4. The `nullifier` has not been used before (replay protection).

No user profile is required (the agent is self-sovereign) and **no human-typing
claim is made** — an `ai_agent` attestation says "agent `surai1…` produced this,"
not "a human typed this."

## Verifying / querying

```
GET /surprotocol/surchain/attestation/v1/verify/{content_hash_hex}
→ { found, attestations: [ { username: "surai1…", origin: "ai_agent",
                             citation, nullifier, timestamp } ] }
```

The explorer's **Verify Origin** page renders this as
*"Produced by an AI agent"* with the agent address (and the owner is the tx signer,
viewable on the transaction).

## Notes / roadmap

- The signing crypto is identical to the device declaration path, so the same
  `secp256k1`/`bech32` primitives (and the chain-side `VerifySignature`) are reused;
  see `x/attestation/keeper/declaration.go` and `declaration_test.go`
  (`TestSubmitAIAgent_SelfSovereign`).
- A thin HTTP relayer / SDK that wraps tx building + signing for non-crypto callers
  is a follow-on (developer-facing SDK layer).
- Phase 2: agent registration (label + bound owner) for a richer "my agent X" view.

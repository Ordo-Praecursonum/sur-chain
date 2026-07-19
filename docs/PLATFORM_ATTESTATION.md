# Platform & Agent Attestation — Endpoint and Domain Binding

How a third-party platform, backend service, or AI agent attests data on Sur
Chain, and how a verifier can confirm the attesting party really operates the
domain it claims. Companion to `AI_AGENT_ATTESTATION.md` (self-sovereign
`surai1…` agents) — this document covers **registered pipeline principals**,
the identity model intended for servers and platforms.

## The two identity models, and when to use which

| | Self-sovereign agent (`surai1…`) | Pipeline principal |
|---|---|---|
| Registration required | No — the key IS the identity | Yes — `MsgRegisterPrincipal` |
| Best for | Individual AI agents | Platforms, backends, editorial pipelines |
| Key type | secp256k1 (Cosmos-style) | P-256 (uncompressed, 65 bytes) |
| Domain claim | — | `domain` field on registration |
| What it can submit | Content attestations (origin `ai_agent`) | Provenance nodes (transformation edges) |

## 1. Register a principal (once)

Broadcast a `MsgRegisterPrincipal` transaction
(`/surchain.provenance.v1.MsgRegisterPrincipal`):

```
creator         — the funding/submitting Sur account (pays fees, public owner)
principal_id    — stable identifier, e.g. "acme-editorial-pipeline"
name            — human-readable label
pubkey          — 65-byte uncompressed P-256 public key (0x04 ‖ X ‖ Y)
principal_type  — e.g. "platform", "agent", "pipeline"
domain          — e.g. "api.acme.com" (optional but recommended — see §3)
```

Anyone can later fetch the record:

```
GET /surprotocol/surchain/provenance/v1/principal/{principal_id}
```

## 2. Attest data / record transformations

Every write is a standard Cosmos transaction broadcast to
`POST /cosmos/tx/v1beta1/txs` (protobuf `TxRaw`, `SIGN_MODE_DIRECT`) — the
same REST base the rest of Sur uses (`https://api-tst-1.surprotocol.org` on
testnet).

To record that content was produced or transformed, submit a
`MsgSubmitProvenanceNode`:

```
content_hash_in     — SHA-256 of the source content (32 bytes)
content_hash_out    — SHA-256 of the produced content (32 bytes)
transformation_type — e.g. "ai_grammar", "human_edit", "translation",
                       "summary", "image_crop", "format"
principal_id        — the registered principal making the claim
sig                 — ECDSA P-256 ASN.1 signature by the principal's key over
                       SHA-256(content_hash_in ‖ content_hash_out ‖
                               transformation_type ‖ principal_id)
```

The chain verifies the signature against the registered principal key before
accepting. Each accepted node is one directed edge of the provenance graph.

## 3. Domain binding — proving "this really came from acme.com"

A consensus network cannot fetch URLs (nodes must agree deterministically, and
the web is neither deterministic nor permanent), so **on-chain, the domain is a
signed claim**: it is part of the registered principal record that every node
signature resolves to. Proving *ownership* of the domain is an off-chain,
verifier-side check with a well-known-URI convention:

1. The platform serves, over HTTPS on the claimed domain:

   ```
   GET https://<domain>/.well-known/sur-principal.json

   {
     "principals": [
       {
         "principal_id": "acme-editorial-pipeline",
         "pubkey": "04a3…"        // hex, must equal the on-chain pubkey
       }
     ]
   }
   ```

2. A verifier (the explorer, an SDK, any consumer):
   - fetches the principal record from the chain (`…/principal/{id}`),
   - fetches `https://<record.domain>/.well-known/sur-principal.json`,
   - checks the id and pubkey appear there.

   Match ⇒ whoever controls that domain vouches for this principal key —
   display a "verified domain" badge. No match / unreachable ⇒ show the domain
   as an **unverified claim**.

This is the same trust pattern as ACME (Let's Encrypt) HTTP-01 and
`security.txt`: control of the web origin is demonstrated by publishing a
specific document on it. Revocation is equally simple — remove the entry from
the well-known file and verifiers stop trusting the binding, even though the
historical chain record remains.

**Limits, stated plainly:** the binding proves *current* control of the domain
at verification time, not control at attestation time; a verifier that never
checks the well-known file gets only the unverified claim. For high-stakes
flows, verifiers should cache their own timestamped observations of the
well-known file.

## 4. Reading the provenance graph

```
GET …/provenance/v1/nodes/{content_hash_hex}
    → { as_input: [edges from this content], as_output: [edges into it] }

GET …/provenance/v1/lineage/{content_hash_hex}?max_depth=16
    → { ancestors: […], descendants: […], truncated: bool }
```

`lineage` walks the graph breadth-first both ways (depth- and size-capped), so
a consumer can render the full story of a piece of content: what it was
derived from (e.g. original human-typed text — check `x/attestation` for a
human-typing proof on the root hash — then an AI grammar pass, then a human
edit) and everything later derived from it.

## 5. End-to-end example: text improved by AI

1. Human types text `T0` with the Sur Keyboard → human-typing attestation for
   `SHA-256(T0)` lands in `x/attestation` (ZK-proven, origin `human_keyboard`).
2. Acme's grammar service (registered principal, domain-bound) improves it to
   `T1` and submits a provenance node `SHA-256(T0) → SHA-256(T1)`,
   `transformation_type: "ai_grammar"`.
3. An editor tweaks a sentence, producing `T2`; the pipeline submits
   `SHA-256(T1) → SHA-256(T2)`, `transformation_type: "human_edit"`.
4. Anyone holding the final text queries `lineage/SHA-256(T2)` and sees the
   whole chain: proven-human root, then each transformation, each signed by a
   domain-bound principal.

# Aggregation & Ethereum Settlement

How Sur Chain attestations are aggregated into a single root and anchored
("settled") on Ethereum, so anyone can prove an attestation exists against an L1
checkpoint.

```
device/agent attestations           Sur Chain                         Ethereum
─────────────────────────           ─────────                         ────────
MsgSubmitAttestation  ──►  x/attestation verifies each proof
(per-item ZK / sig)        and stores the record
                                     │
                           AggregateRoot query: keccak Merkle root
                           over ALL accepted attestation leaves
                                     │  (relay-checkpoint.sh)
                                     ▼
                           AttestationSettlement.submitCheckpoint(
                             epochId, root, leafCount, sourceHeight)
                                     │
                           verifyInclusion(epochId, leaf, proof) ◄── anyone
```

## The Merkle scheme (chain ↔ contract must match)

- **Leaf** (computed by the chain, `x/attestation/keeper/settlement.go`):
  `leaf = keccak256( keccak256(deviceId) ‖ contentHash ‖ nullifier ‖ keccak256(origin) )`
- **Internal node**: `keccak256( min(a,b) ‖ max(a,b) )` (sorted-pair, commutative).
- Leaves are **sorted ascending** before building the tree, so the root is
  deterministic and reproducible from chain state.

This is the same scheme `AttestationSettlement._hashPair` / `_processProof`
verify on L1, so a proof produced by the chain's `MerkleProof` query verifies
directly via `verifyInclusion`.

## Chain side (aggregation)

Two queries (see `proto/surchain/attestation/v1/query.proto`):

- `GET /surprotocol/surchain/attestation/v1/aggregate-root`
  → `{ root, leaf_count, height }` — the value to settle.
- `GET /surprotocol/surchain/attestation/v1/merkle-proof/{contentHashHex}`
  → `{ found, root, leaf, proof[] }` — an inclusion proof for L1 verification.

(Phase note: the root currently aggregates **all** accepted attestations as a
running snapshot keyed by chain height. Windowing by `x/epochs` into fixed epochs
is a small follow-on — the leaf/root scheme and the contract are unchanged.)

## Ethereum side (settlement)

`sur-evm-contracts/src/AttestationSettlement.sol`:

- `submitCheckpoint(epochId, root, leafCount, sourceHeight)` — settler-only,
  immutable per epoch.
- `getCheckpoint(epochId)` / `isSettled(epochId)`.
- `verifyInclusion(epochId, leaf, proof[])` — sorted-pair keccak Merkle proof.

Tests: `forge test`

Deploy: `forge script script/DeploySettlement.s.sol --rpc-url $ETH_RPC --private-key $KEY --broadcast`.

## Running the relayer

```
CONTRACT=0x… PRIVATE_KEY=0x… ETH_RPC=http://localhost:8545 \
  CHAIN_REST=http://localhost:1317 \
  ./sur-evm-contracts/script/relay-checkpoint.sh
```

It reads the chain's aggregate root and calls `submitCheckpoint`. Run it on a
schedule (cron / per-epoch hook) to keep L1 in sync.

## Trust model & the Stage-3 upgrade

Today settlement anchors the Sur Chain's **already-verified** batch: every device
proof / agent signature was verified on-chain at submit time, and the relayer
posts the resulting root. So the L1 contract trusts the **settler** (the chain's
relayer) for the root's correctness, while inclusion against that root is
trustlessly checkable by anyone.

The planned upgrade (Stage 3) makes the root itself trustless: an **SP1 recursive
STARK** re-verifies the epoch's device proofs inside a zkVM and produces a
succinct proof, wrapped to Groth16; `submitCheckpoint` is then gated on verifying
that proof on-chain instead of trusting the settler. The storage + `verifyInclusion`
interface here does not change — only how a root becomes accepted. The Starknet
settlement path verifies the STARK natively (post-quantum preserved); the
EVM/Solana paths use the Groth16 wrap.

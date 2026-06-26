import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/surchain/attestation/v1/tx";
import { MsgSubmitAttestation } from "./types/surchain/attestation/v1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/surchain.attestation.v1.MsgUpdateParams", MsgUpdateParams],
    ["/surchain.attestation.v1.MsgSubmitAttestation", MsgSubmitAttestation],
    
];

export { msgTypes }
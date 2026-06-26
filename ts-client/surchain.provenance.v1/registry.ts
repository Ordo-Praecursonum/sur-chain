import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/surchain/provenance/v1/tx";
import { MsgRegisterPrincipal } from "./types/surchain/provenance/v1/tx";
import { MsgSubmitProvenanceNode } from "./types/surchain/provenance/v1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/surchain.provenance.v1.MsgUpdateParams", MsgUpdateParams],
    ["/surchain.provenance.v1.MsgRegisterPrincipal", MsgRegisterPrincipal],
    ["/surchain.provenance.v1.MsgSubmitProvenanceNode", MsgSubmitProvenanceNode],
    
];

export { msgTypes }
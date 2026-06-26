import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/surchain/identity/v1/tx";
import { MsgRegisterUsername } from "./types/surchain/identity/v1/tx";
import { MsgAddDevice } from "./types/surchain/identity/v1/tx";
import { MsgRevokeDevice } from "./types/surchain/identity/v1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/surchain.identity.v1.MsgUpdateParams", MsgUpdateParams],
    ["/surchain.identity.v1.MsgRegisterUsername", MsgRegisterUsername],
    ["/surchain.identity.v1.MsgAddDevice", MsgAddDevice],
    ["/surchain.identity.v1.MsgRevokeDevice", MsgRevokeDevice],
    
];

export { msgTypes }
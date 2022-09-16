import { Statement } from "../../entities/Statement";

export type IToTransferDTO =
Pick<
  Statement,
  'user_id' |
  'sender_id' |
  'description' |
  'amount' |
  'type' |
  'created_at' |
  'updated_at' 

>

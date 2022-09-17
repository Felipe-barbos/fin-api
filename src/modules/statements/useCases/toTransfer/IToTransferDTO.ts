import { Statement } from "../../entities/Statement";

export type IToTransferDTO =
  Pick<
    Statement,
    'recipient_id' |
    'sender_id' |
    'description' |
    'amount' |
    'type'

  >

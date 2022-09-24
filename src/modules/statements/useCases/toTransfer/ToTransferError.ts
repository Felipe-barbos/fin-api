import { AppError } from "../../../../shared/errors/AppError";

export namespace GetReceiverOperationError{
  export class ReceiverNotfound extends AppError {
    constructor (){
      super('Receiver not found', 404);
    }
  }
}
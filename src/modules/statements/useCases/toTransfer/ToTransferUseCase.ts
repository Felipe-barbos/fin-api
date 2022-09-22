import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";

import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";

interface IToTransfer {
  user_id: string;
  sender_id: string;
  amount: number;
  description: string;
}


@injectable()
export class ToTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }


  async execute({ user_id, sender_id, amount, description }: IToTransfer): Promise<Statement[]> {



    const user = await this.usersRepository.findById(user_id);

    if (!user || user.id === sender_id) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id, with_statement: false });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    const transferSender = await this.statementsRepository.create({
      user_id,
      receiver_id: user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    });

    const transferReceiver = await this.statementsRepository.create({
      user_id: sender_id,
      receiver_id: user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    });




    return [
      transferSender,
      transferReceiver
    ]

  }
}


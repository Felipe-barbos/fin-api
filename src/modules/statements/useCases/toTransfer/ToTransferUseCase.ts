import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { IToTransferDTO } from "./IToTransferDTO";
import { ToTransferError } from "./ToTransferError";


@injectable()
export class ToTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }


  async execute({ recipient_id, sender_id, amount, type, description }: IToTransferDTO) {



    const user = await this.usersRepository.findById(recipient_id as string);

    if (!user) {
      throw new ToTransferError.UserNotFound();
    }

    if (type === 'transfer') {

      const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id as string });


      if (balance < amount) {
        throw new ToTransferError.InsufficientFunds();
      }
    }


    await this.statementsRepository.create({
      user_id: recipient_id as string,
      amount,
      type: OperationType.DEPOSIT,
      description,


    });

    const transferToSender = await this.statementsRepository.create({
      user_id: sender_id as string,
      amount,
      type,
      description,

    });


    return transferToSender;

  }
}


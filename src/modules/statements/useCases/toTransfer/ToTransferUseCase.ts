import { inject } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { IToTransferDTO } from "./IToTransferDTO";



export class ToTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsREpository')
    private statementsRepository: IStatementsRepository
  ){}


  async execute({user_id, sender_id, amount,type, description, created_at, updated_at}: IToTransferDTO){
    
  }
}


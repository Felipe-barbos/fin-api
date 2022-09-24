import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetReceiverOperationError } from "./ToTransferError";
import { ToTransferUseCase } from "./ToTransferUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let toTransferUseCase: ToTransferUseCase;

describe("Create a transfer", () =>{
  beforeEach(() =>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    toTransferUseCase = new ToTransferUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  });

  it("Should be transfer a amount in receiver", async () =>{
    const user1: ICreateUserDTO ={
      email: "felipe@gmail.com",
      name: "Felipe Barbosa Castro",
      password: "12345"
    }

    await createUserUseCase.execute(user1);

    const user1Created = await inMemoryUsersRepository.findByEmail(user1.email);


    const user2: ICreateUserDTO ={
      email: "matheus@gmail.com",
      name: "Matheus Barbosa Castro",
      password: "12345"
    }

    await createUserUseCase.execute(user2);

    const user2Created = await inMemoryUsersRepository.findByEmail(user2.email);


    const statement: ICreateStatementDTO = {
      user_id: user1Created?.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Test statement"

  }

  const statementCreated = await createStatementUseCase.execute(statement);


    const transfer ={
      user_id: user2Created?.id as string,
      sender_id: user1Created?.id as string,
      amount: 200,
      description: "transfer test",

    }

    const transferCreated = await toTransferUseCase.execute(transfer);

    expect(transferCreated[0]).toHaveProperty("receiver_id");
    expect(transferCreated[0]).toHaveProperty("sender_id");
    expect(transferCreated[1]).toHaveProperty("receiver_id");
    expect(transferCreated[1]).toHaveProperty("sender_id");
    expect(transferCreated[0]).toHaveProperty("user_id");
    expect(transferCreated[1]).toHaveProperty("user_id");
    

    
});

it("Should not be transfer a amount in valid receiver", async () =>{
  expect(async () => {

    const user1: ICreateUserDTO ={
      email: "felipe@gmail.com",
      name: "Felipe Barbosa Castro",
      password: "12345"
    }
  
    await createUserUseCase.execute(user1);
  
    const user1Created = await inMemoryUsersRepository.findByEmail(user1.email);
  
  
    const statement: ICreateStatementDTO = {
      user_id: user1Created?.id as string,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Test statement"
  
  }
  
   await createStatementUseCase.execute(statement);
  
  
    const transfer ={
      user_id: 'invalid id',
      sender_id: user1Created?.id as string,
      amount: 200,
      description: "transfer test",
  
    }
  
    await toTransferUseCase.execute(transfer);
  }).rejects.toBeInstanceOf(GetReceiverOperationError.ReceiverNotfound);
});

});
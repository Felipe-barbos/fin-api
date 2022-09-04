import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;





describe("Create a statement", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        
    });

    it("Should be deposit a  amount in user", async () => {

        const user: ICreateUserDTO = {
            email: "felipe@gmail.com",
            name: "Felipe Barbosa Castro",
            password: "12345"
        }

        await createUserUseCase.execute(user);

        const userCreated = await inMemoryUsersRepository.findByEmail(user.email);


        const statement: ICreateStatementDTO = {
            user_id: userCreated?.id as string,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "Test statement"

        }

        const statementCreated = await createStatementUseCase.execute(statement);


        expect(statementCreated).toHaveProperty("id");
    });



    it("Should not be deposit a amount in invalid user", async () => {


        expect(async () => {
            const user: ICreateUserDTO = {
                email: "felipe@gmail.com",
                name: "Felipe Barbosa Castro",
                password: "12345"
            }

            await createUserUseCase.execute(user);

            const userCreated = await inMemoryUsersRepository.findByEmail(user.email);


            const statement: ICreateStatementDTO = {
                user_id: "id invalid",
                type: OperationType.DEPOSIT,
                amount: 1000,
                description: "Test statement"

            }

            await createStatementUseCase.execute(statement);



        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);

    });



    it("Should be withdraw a amount in user", async () => {

        const user: ICreateUserDTO = {
            email: "felipe@gmail.com",
            name: "Felipe Barbosa Castro",
            password: "12345"
        }

        await createUserUseCase.execute(user);

        const userCreated = await inMemoryUsersRepository.findByEmail(user.email);


        const statementDeposit: ICreateStatementDTO = {
            user_id: userCreated?.id as string,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "Test statement"

        }

        const statementDepositCreated = await createStatementUseCase.execute(statementDeposit);

        const statementWithdraw: ICreateStatementDTO = {
            user_id: userCreated?.id as string,
            type: OperationType.WITHDRAW,
            amount: 500,
            description: "Test statement2"
        }

        const statementWithDrawCreated = await createStatementUseCase.execute(statementWithdraw);

        expect(statementDepositCreated).toHaveProperty("id");
        expect(statementWithDrawCreated).toHaveProperty("id");

    });

    it("Should be not withdraw a amount in user if  value is greatest that balance ", async () => {

        expect(async () => {
            const user: ICreateUserDTO = {
                email: "felipe@gmail.com",
                name: "Felipe Barbosa Castro",
                password: "12345"
            }

            await createUserUseCase.execute(user);

            const userCreated = await inMemoryUsersRepository.findByEmail(user.email);


            const statementDeposit: ICreateStatementDTO = {
                user_id: userCreated?.id as string,
                type: OperationType.DEPOSIT,
                amount: 1000,
                description: "Test statement"

            }

            await createStatementUseCase.execute(statementDeposit);

            const statementWithdraw: ICreateStatementDTO = {
                user_id: userCreated?.id as string,
                type: OperationType.WITHDRAW,
                amount: 1500,
                description: "Test statement2"
            }

            await createStatementUseCase.execute(statementWithdraw);

            
            
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);



    });





    
});

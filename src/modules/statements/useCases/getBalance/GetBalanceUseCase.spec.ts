import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";




let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;



describe("Get balance by user", () => {


    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    })


    it("Should by able to get a balance by user", async () => {

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
            amount: 500,
            description: "Test statement2"
        }

        await createStatementUseCase.execute(statementWithdraw);

        const balance = await getBalanceUseCase.execute({
            user_id: userCreated?.id as string
        })




        expect(balance).toHaveProperty("balance");
    });


    it("Should not be able to get a balance by user invalid", async () => {
        

        expect(async () => {

            const user: ICreateUserDTO = {
                email: "oliveira@gmail.com",
                name: "Felipe Barbosa Castro",
                password: "23455"
            }
    
          const userCreated =   await createUserUseCase.execute(user);

            await getBalanceUseCase.execute({
                user_id: "id invalid"
            });

        }).rejects.toBeInstanceOf(GetBalanceError);


    })
});



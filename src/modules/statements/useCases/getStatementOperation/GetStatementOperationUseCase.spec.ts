import { stat } from "fs";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository : InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase : CreateStatementUseCase;
let getStatementOperationUseCase : GetStatementOperationUseCase;


describe("Get Statement Operation", () => {

    beforeEach(()=>{
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

    })

    it("Should be get a statement operation by user", async () => {

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

        const getStatement = await getStatementOperationUseCase.execute({
            user_id: userCreated?.id as string,
            statement_id: statementCreated.id as string,
        });

      

        expect(getStatement).toHaveProperty("id");
        expect(getStatement).toHaveProperty("user_id");
    });


    it("should by not able to get a statement operation a invalid id", async () => {

        expect(async () => {

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

            await getStatementOperationUseCase.execute({
                user_id: userCreated?.id as string,
                statement_id: "invalid statement",
            });


        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);




    });


    it("should by not able to get a statement operation a invalid user_id", async () => {

        expect( async () => {

            await getStatementOperationUseCase.execute({
                user_id: "user id invalid",
                statement_id: "teste",
            });

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);

    });


});
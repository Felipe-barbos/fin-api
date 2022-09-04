import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository = new InMemoryUsersRepository();
let inMemoryStatementsRepository = new InMemoryStatementsRepository();
let createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
let createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
let getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);


describe("Get Statement Operation", () => {

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



    })
});
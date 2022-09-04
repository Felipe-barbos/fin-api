import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";



let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;



describe("Authenticate User", () => {

    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });


    it("should be abler to authenticate a user", async () => {
        const user: ICreateUserDTO = {
            email: "felipe@gmail.com",
            name: "Felipe Barbosa",
            password: "1234",
        }

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate with incorrect password", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "oliveira@gmail.com",
                name: "Oliveira Marques",
                password: "12345",
            }

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: 'Incorrect Password'
            });

        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })


    it("should not be able to authenticate with incorrect email", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                email: "leandro@gmail.com",
                name: "leandro Marques",
                password: "54321",
            }

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: "emailincorrect@gmail.com",
                password: user.password
            });

        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })
});
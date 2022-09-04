import { profile } from "console";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show by user profile", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    })


    it("should return user profile", async () => {

        const userCreated = await createUserUseCase.execute({
            email: "felipe@gmail.com",
            name: "Felipe Barbosa Castro",
            password: "12345"

        });



        const profile = await showUserProfileUseCase.execute(
            userCreated.id as string);


        expect(profile).toHaveProperty("id");

    });


    it("should  not return user profile with id invalid", async () => {


        expect(async () => {
            const profile = await showUserProfileUseCase.execute(
                "id invalid");


        }).rejects.toBeInstanceOf(ShowUserProfileError);



    });


});
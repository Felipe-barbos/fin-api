import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;

let inMemoryUsersRepository: InMemoryUsersRepository;



describe("Create User", () =>{


    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be abler to create a new user", async () =>{

        const user = {
            name:"Felipe Barbosa",
            email: "felipe@gmail.com",
            password: "123452"
        }

      await  createUserUseCase.execute({
           email: user.email,
           name: user.name,
           password: user.password
        });

        const userCreated =  await inMemoryUsersRepository.findByEmail(user.email);

       


        expect(userCreated).toHaveProperty("id");
        

    });

    it("should not be abler to create a new user with email exists", async () =>{

       expect(async ()=> {

        const user = {
            name:"Felipe Barbosa",
            email: "felipe@gmail.com",
            password: "123452"
        }

        await  createUserUseCase.execute({
           email: user.email,
           name: user.name,
           password: user.password
        });

        await  createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password
         });
       }).rejects.toBeInstanceOf(CreateUserError);

       
    });

});
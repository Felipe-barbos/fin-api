import { createConnection } from "net";
import request from "supertest";
import { Connection } from "typeorm";

import  getConnection  from "../../../../database";
import {app} from "../../../..//app";


let connection : Connection;

describe("Authenticate User", ()=>{
    beforeAll( async () =>{
    connection = await getConnection("localhost");
    await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
      });


    it("should be able authenticate a user", async ()=>{
      
        await request(app).post("/api/v1/users")
        .send({
            name: "Carlos Anderson",
	        email: "carlos155@gmail.com",
	        password: "212244"
        });

        const responseToken = await request(app).post("/api/v1/sessions")
        .send({
            email: "carlos155@gmail.com",
            password: "212244"
        });

        

        expect(responseToken.body).toHaveProperty("token");

    });

    it("should not able to authenticate with incorrect password", async ()=>{
        await request(app).post("/api/v1/users")
        .send({
            name: "Carlos Anderson",
	        email: "carlos155@gmail.com",
	        password: "212244"
        });

       const  response = await request(app).post("/api/v1/sessions")
        .send({
            email: "carlos155@gmail.com",
            password: "incorrect"
        });

        expect(response.body.message).toBe("Incorrect email or password");
    });



    it("should not able to authenticate with incorrect email", async ()=>{
        await request(app).post("/api/v1/users")
        .send({
            name: "Carlos Anderson",
	        email: "carlos155@gmail.com",
	        password: "212244"
        });

       const  response = await request(app).post("/api/v1/sessions")
        .send({
            email: "w@gmail.com",
            password: "212233"
        });

        expect(response.body.message).toBe("Incorrect email or password");
    });


});


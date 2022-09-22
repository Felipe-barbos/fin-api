import { createConnection } from "net";
import request from "supertest";
import { Connection } from "typeorm";

import getConnection from "../../../../database";
import { app } from "../../../..//app";


let connection: Connection;

describe("Create User", () => {
    beforeAll(async () => {
        connection = await getConnection("localhost");
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });




    it("should be able to create  a new user", async () => {

        const response = await request(app).post("/api/v1/users")
            .send({
                name: "Carlos Anderson",
                email: "carlos155@gmail.com",
                password: "212244"
            });

        expect(response.status).toBe(201);

    });

    it("should  not be abler to create a user if the email is already registered", async () => {
        await request(app).post("/api/v1/users")
            .send({
                name: "Carlos Anderson",
                email: "carlos155@gmail.com",
                password: "212244"
            });

        const response = await request(app).post("/api/v1/users")
            .send({
                name: "Felipe Barbosa Castro",
                email: "carlos155@gmail.com",
                password: "212244"
            });


        expect(response.status).toBe(400);
        expect(response.body.message).toBe("User already exists");
    });
});


import { createConnection } from "net";
import request from "supertest";
import { Connection } from "typeorm";

import getConnection from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;

describe("Get statement operation by user", () => {

    beforeAll(async () => {
        connection = await getConnection("localhost");
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });


    it("should be able to get a statement operation by user", async () => {

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


        const { token } = responseToken.body;

        const deposit = await request(app).post("/api/v1/statements/deposit")
            .send({
                amount: 900,
                description: "Deposit test"
            })
            .set({
                Authorization: `JWT ${token}`
            });


        const statementOperationId = deposit.body.id;

        const statementOperation = await request(app)
            .get(`/api/v1/statements/${statementOperationId}`)
            .set({
                Authorization: `JWT ${token}`
            });



        expect(statementOperation.body).toHaveProperty("user_id");
        expect(statementOperation.body).toHaveProperty("amount");
        expect(statementOperation.status).toBe(200);

    });

    it("Should not be abler to get a balance by user if id invalid in statement", async () => {
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


        const { token } = responseToken.body;

        const statementOperationId = 'fd07dbb2-10b0-4389-a61d-e0e4cf5045e2';

        const statementOperation = await request(app)
            .get(`/api/v1/statements/${statementOperationId}`)
            .set({
                Authorization: `JWT ${token}`
            });

        expect(statementOperation.status).toBe(404);
        expect(statementOperation.body.message).toBe("Statement not found");

    });

});
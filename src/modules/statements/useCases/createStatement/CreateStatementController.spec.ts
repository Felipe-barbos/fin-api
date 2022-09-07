import { createConnection } from "net";
import request from "supertest";
import { Connection } from "typeorm";

import getConnection from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;

describe("create statement in user",  () => {
    beforeAll(async () => {
        connection = await getConnection("localhost");
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });


    it("should be deposit a amount in user", async () => {

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


        expect(deposit.body).toHaveProperty("id");
        expect(deposit.status).toBe(201);

       


    });


    it("should be withdraw a amount in user", async () => {

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

        await request(app).post("/api/v1/statements/deposit")
            .send({
                amount: 900,
                description: "Deposit test"
            })
            .set({
                Authorization: `JWT ${token}`
            });
        
        const withdraw = await request(app).post("/api/v1/statements/withdraw")
        .send({
            amount: 300,
            description: "Withdraw test"
        }).set({
            Authorization: `JWT ${token}`
        });




        expect(withdraw.body).toHaveProperty("id");
        expect(withdraw.status).toBe(201);

    });

    it("should not be deposit and withdraw in invalid user token", async () => {


      
        const deposit = await request(app).post("/api/v1/statements/deposit")
            .send({
                amount: 900,
                description: "Deposit test"
            })
            .set({
                Authorization: `JWC invalid token`
            });
        
        const withdraw = await request(app).post("/api/v1/statements/withdraw")
        .send({
            amount: 300,
            description: "Withdraw test"
        }).set({
            Authorization: `JWT invalid token`
        });




        expect(deposit.status).toBe(401);
        expect(deposit.body.message).toBe("JWT invalid token!");
        expect(withdraw.status).toBe(401);
        expect(withdraw.body.message).toBe("JWT invalid token!");

    });
    


    




});


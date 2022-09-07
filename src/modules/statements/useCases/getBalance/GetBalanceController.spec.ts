import { createConnection } from "net";
import request from "supertest";
import { Connection } from "typeorm";

import getConnection from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;

describe("get balance in user",  () => {
    beforeAll(async () => {
        connection = await getConnection("localhost");
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });


    it("should be able to get a balance by user", async () => {

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

        await request(app).post("/api/v1/statements/withdraw")
            .send({
                amount: 300,
                description: "withdraw test"
            })
            .set({
                Authorization: `JWT ${token}`
            });
        
        const balance =  await request(app).get("/api/v1/statements/balance")
            .set({
                Authorization: `JWT ${token}`
            });
        
        expect(balance.body).toHaveProperty("balance");
        expect(balance.status).toBe(200);
    });


    it("Should not be abler to get a balance by user token invalid", async  () =>{
        const balance =  await request(app).get("/api/v1/statements/balance")
            .set({
                Authorization: `JWT invalid token`
            });
        
        expect(balance.body.message).toBe("JWT invalid token!");
        expect(balance.status).toBe(401);
    })

});
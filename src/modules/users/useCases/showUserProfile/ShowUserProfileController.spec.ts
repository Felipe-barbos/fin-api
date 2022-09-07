import { createConnection } from "net";
import request from "supertest";
import { Connection } from "typeorm";

import getConnection from "../../../../database";
import { app } from "../../../../app";


let connection: Connection;

describe("Show user profile", () => {
    beforeAll(async () => {
        connection = await getConnection("localhost");
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });


    it("should be able show profile user", async () => {

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

        const profile = await request(app).get("/api/v1/profile")
            .set({
                Authorization: `JWT ${token}`
            });

        expect(profile.body).toHaveProperty("id");
        expect(profile.status).toBe(200);


    });


    it("should not  return profile with token invalid", async () => {


        const profile = await request(app).get("/api/v1/profile")
            .set({
                Authorization: `JWT InvalidToken`
            });

        
        expect(profile.body.message).toBe("JWT invalid token!");


    });




});


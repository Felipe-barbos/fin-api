import { createConnection } from "net";
import request from "supertest";
import { Connection } from "typeorm";

import getConnection from "../../../../database";
import { app } from "../../../../app";
import { CreateStatementError } from "../createStatement/CreateStatementError";


let connection: Connection;

describe("Create transfer in receiver", () => {
  beforeAll(async () => {
    connection = await getConnection("localhost");
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be transfer a amount in receiver", async () => {
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


    const { id } = responseToken.body.user;



    await request(app).post("/api/v1/users")
      .send({
        name: "Felipe Barbosa ",
        email: "felipe@gmail.com",
        password: "12345"
      });

    const responseToken2 = await request(app).post("/api/v1/sessions")
      .send({
        email: "felipe@gmail.com",
        password: "12345"
      });

    const { token } = responseToken2.body;

    await request(app).post("/api/v1/statements/deposit")
      .send({
        amount: 900,
        description: "Deposit test"
      })
      .set({
        Authorization: `JWT ${token}`
      });


    const transfer = await request(app).post(`/api/v1/statements/transfer/${id}`)
      .send({
        amount: 300,
        description: "transfer test"
      })
      .set({
        Authorization: `JWT ${token}`
      });

    expect(transfer.status).toBe(201);
    expect(transfer.body[0].user_id).toBe(`${id}`);
    expect(transfer.body[0].receiver_id).toBe(`${id}`);
    expect(transfer.body[1]).toHaveProperty("sender_id");
    expect(transfer.body[1].amount).toBe(300);

  });

  it("should not be transfer in invalid user", async () => {

    await request(app).post("/api/v1/users")
      .send({
        name: "Felipe Barbosa ",
        email: "felipe@gmail.com",
        password: "12345"
      });

    const responseToken2 = await request(app).post("/api/v1/sessions")
      .send({
        email: "felipe@gmail.com",
        password: "12345"
      });

    const { token } = responseToken2.body;

    await request(app).post("/api/v1/statements/deposit")
      .send({
        amount: 900,
        description: "Deposit test"
      })
      .set({
        Authorization: `JWT ${token}`
      });

    const id = "18734431-f18f-47e8-90e7-e07f6faf6c22";

    const transfer = await request(app).post(`/api/v1/statements/transfer/${id}`)
      .send({
        amount: 300,
        description: "transfer test"
      })
      .set({
        Authorization: `JWT ${token}`
      });

    expect(transfer.status).toBe(404);
    expect(transfer.body.message).toBe("Receiver not found");
  });


  it("should not be transfer in receiver if amount it's may that balance", async () => {

    expect(async () => {

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


      const { id } = responseToken.body.user;

      await request(app).post("/api/v1/users")
        .send({
          name: "Felipe Barbosa ",
          email: "felipe@gmail.com",
          password: "12345"
        });

      const responseToken2 = await request(app).post("/api/v1/sessions")
        .send({
          email: "felipe@gmail.com",
          password: "12345"
        });

      const { token } = responseToken2.body;

      await request(app).post(`/api/v1/statements/transfer/${id}`)
        .send({
          amount: 1200,
          description: "transfer test"
        })
        .set({
          Authorization: `JWT ${token}`
        });


    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);



  });


});
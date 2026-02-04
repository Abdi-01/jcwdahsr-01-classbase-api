import App from "../src/app";
import request from "supertest";

const appTest = new App().app;

describe("Authentication TEST", () => {
  // GOOD
  it("Should login successfully with correct data", async () => {
    const res = await request(appTest).post("/auth/login").send({
      email: "beni@mail.com",
      password: "1234",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  // BAD
  it("Should fail login with incorrect password", async () => {
    const res = await request(appTest).post("/auth/login").send({
      email: "beni@mail.com",
      password: "1",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Wrong password");
  });
});

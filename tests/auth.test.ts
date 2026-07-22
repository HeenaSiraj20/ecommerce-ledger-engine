import request from "supertest";
import app from "../src/app";

describe("Authentication", () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "Password123",
  };

  let token = "";

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("should login successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("should reject invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "WrongPassword",
      });

    expect(res.status).toBe(401);
  });

  it("should access protected route with JWT", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it("should reject request without JWT", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
  });
});
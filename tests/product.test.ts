import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/db";

describe("Product API", () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    const email = `admin${Date.now()}@example.com`;
    const password = "Password123";

    // Register user
    await request(app).post("/api/auth/register").send({
      email,
      password,
    });

    // Promote user to ADMIN
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    // Login
    const login = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    token = login.body.token;
  });

  it("GET /api/products should return products", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("POST /api/products should create a product", async () => {
    const response = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "MacBook Pro",
        description: "Apple laptop",
        priceCents: 199999,
        stockQuantity: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("MacBook Pro");

    productId = response.body.id;
  });

  it("PUT /api/products/:id should update product", async () => {
    const response = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "MacBook Pro M4",
        description: "Updated",
        priceCents: 209999,
        stockQuantity: 8,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("MacBook Pro M4");
  });

  it("DELETE /api/products/:id should delete product", async () => {
    const response = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted successfully");
  });
});
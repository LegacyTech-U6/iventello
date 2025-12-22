const request = require("supertest");
const app = require("../index");

describe("Sales API", () => {
  it("should record a sale", async () => {
    const res = await request(app)
      .post("api/sales/add")
      .send({
        product_id: 1,
        quantity: 2,
        total_price: 100,
        date: "2025-09-05"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Sale recorded successfully");
  });

  it("should get all sales", async () => {
    const res = await request(app).get("/sales");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get low stock products", async () => {
    const res = await request(app).get("api/products/low-stock");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get out-of-stock products", async () => {
    const res = await request(app).get("api/products/out-of-stock");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

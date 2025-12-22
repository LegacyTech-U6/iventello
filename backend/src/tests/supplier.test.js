const request = require("supertest");
const app = require("../index");

describe("Supplier API", () => {
  it("should create a supplier", async () => {
    const res = await request(app)
      .post("/api/suppliers/add")
      .send({ name: "Supplier X", phone: "123456789" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Supplier added successfully");
  });

  it("should get all suppliers", async () => {
    const res = await request(app).get("/api/suppliers");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a supplier", async () => {
    const createRes = await request(app)
      .post("/api/suppliers/add")
      .send({ name: "To Update", phone: "111222333" });

    const supplierId = createRes.body.supplier.id;

    const res = await request(app)
      .put(`/api/suppliers/${supplierId}`)
      .send({ name: "Updated Supplier" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Supplier updated successfully");
  });

  it("should delete a supplier", async () => {
    const createRes = await request(app)
      .post("/api/suppliers/add")
      .send({ name: "To Delete", phone: "444555666" });

    const supplierId = createRes.body.supplier.id;

    const res = await request(app).delete(`/api/suppliers/${supplierId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Supplier deleted");
  });
});

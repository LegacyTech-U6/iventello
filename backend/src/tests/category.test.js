const request = require("supertest");
const app = require("../index");

describe("Category API", () => {
  it("should create a category", async () => {
    const res = await request(app)
      .post("/api/category/")
      .send({ name: "Electronics" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Category added successfully");
  });

  it("should get all categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a category", async () => {
    const createRes = await request(app)
      .post("/api/category/")
      .send({ name: "To Update" });

    const categoryId = createRes.body.category.id;

    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .send({ name: "Updated Category" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Category updated successfully");
  });

  it("should delete a category", async () => {
    const createRes = await request(app)
      .post("/api/category/")
      .send({ name: "To Delete" });

    const categoryId = createRes.body.category.id;

    const res = await request(app).delete(`/api/category/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Category deleted successfully");
  });
});

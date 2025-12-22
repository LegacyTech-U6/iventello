const request = require("supertest");
const app = require("../index");
const pool = require("../config/db");

describe("Product API", () => {
  it("should create a product without image", async () => {
    const res = await request(app)
      .post("/api/products/add")
      .field("Prod_name", "Test Product")
      .field("quantity", 10)
      .field("cost_price", 50)
      .field("selling_price", 80)
      .field("category", 1)
      .field("Prod_Description", "Test description")
      .field("code_bar", "123456789")
      .field("date_of_arrival", "2025-09-05")
      .field("supplier", "Test Supplier");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Product added successfully");
  });

  it("should create a product with image", async () => {
    const res = await request(app)
      .post("/api/products/add")
      .field("Prod_name", "Product with image")
      .field("quantity", 5)
      .field("cost_price", 100)
      .field("selling_price", 150)
      .field("category", 2)
      .field("Prod_Description", "Has image")
      .field("code_bar", "987654321")
      .field("date_of_arrival", "2025-09-05")
      .field("supplier", "Supplier X")
      .attach("Prod_image", "__tests__/fixtures/test.png");

    expect(res.statusCode).toBe(201);
    expect(res.body.product).toHaveProperty("Prod_image");
  });

  it("should get all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a product", async () => {
    const createRes = await request(app)
      .post("/api/products/add")
      .field("Prod_name", "To Update")
      .field("quantity", 5)
      .field("cost_price", 50)
      .field("selling_price", 80)
      .field("category", 1)
      .field("Prod_Description", "Before update")
      .field("code_bar", "111222333")
      .field("date_of_arrival", "2025-09-05")
      .field("supplier", "Supplier");

    const productId = createRes.body.product.id;

    const res = await request(app)
      .put(`/api/products/${productId}`)
      .field("Prod_name", "Updated Name");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Product updated successfully");
  });

  it("should delete a product", async () => {
    const createRes = await request(app)
      .post("/api/products/add")
      .field("Prod_name", "To Delete")
      .field("quantity", 5)
      .field("cost_price", 50)
      .field("selling_price", 80)
      .field("category", 1)
      .field("Prod_Description", "Delete me")
      .field("code_bar", "444555666")
      .field("date_of_arrival", "2025-09-05")
      .field("supplier", "Supplier");

    const productId = createRes.body.product.id;

    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Product deleted successfully");
  });
});

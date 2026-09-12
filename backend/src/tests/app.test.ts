import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("FlowForge API", () => {
  it("GET / should return API status", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("GET /health should return database status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.database).toBe("connected");
  });

  it("unknown route should return 404", async () => {
    const response = await request(app).get("/this-route-does-not-exist");

    expect(response.status).toBe(404);
  });
});

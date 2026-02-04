import App from "../src/app";
import request from "supertest";
import { prisma } from "../src/config/prisma";

const appTest = new App().app;

// Testing scenario
describe("Connection testing", () => {
  beforeAll(async () => {
    // Menyiapkan program/function yang ingin dijalankan
    // sebelum semua skenario testing dieksekusi
    await prisma.$connect();
  });

  beforeEach(() => {
    // Menyiapkan function yang ingin dijalankan
    // sebelum tiap skenario testing
  });

  afterAll(async () => {
    // Menyiapkan program/function yang ingin dijalankan
    // sesudah semua skenario testing dieksekusi
    await prisma.$disconnect();
  });

  afterEach(() => {
    // Menyiapkan function yang ingin dijalankan
    // sesudah tiap skenario testing
  });

  // Good scenario
  it("Should return message from main route", async () => {
    const res = await request(appTest).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toEqual("<h1>Classbase API</h1>");
  });

  // Bad scenario
  it("Should return NOT FOUND", async () => {
    const res = await request(appTest).get("/transactions");

    expect(res.status).toBe(404);
  });
});

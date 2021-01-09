// Write your tests here
const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

//user for register
const testUser = {
  username: "test",
  password: "test",
  email: "test",
  role_id: 1,
};
//user for login
const testLogin = { username: "test", password: "test" };

describe("server.js", () => {
  //describe 1 GET /api/users
  describe("GET request for /api/users", () => {
    test("should return a status code of 404 when not logged in", async () => {
      const res = await request(server).get("/api/users");
      expect(res.status).toBe(401);
    });
    test("should return json", async () => {
      const res = await request(server).get("/api/users");
      expect(res.type).toBe("application/json");
    });
  });
  //describe 2 POST /api/auth/register  --- new user
  describe("registering new user", () => {
    test("should return with a status code of 201 when registering", async () => {
      await db("users").truncate();
      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser);
      expect(res.status).toBe(201);
    });
    test("should return a status of 500 if user is registered already", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser); //sending the same user from testUser
      expect(res.status).toBe(500);
    });
  });
  //describe 3 POST /api/auth/login
  describe("login with user", () => {
    test("should return a status code of 201 with logged in user", async () => {
      const res = await request(server).post("/api/auth/login").send(testLogin);
      expect(res.status).toBe(201);
    });
    test("should return with status 401 if invalid credentials", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "testwrong", password: "testwrong" });
      expect(res.status).toBe(401);
    });
  });
});

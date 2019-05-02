const server = require("../api/server.js");
const request = require("supertest");
const db = require("../data/knexConfig.js");

const mytruncate = async () => {
  await db.schema.raw("TRUNCATE TABLE users CASCADE");
  await db.schema.raw("TRUNCATE TABLE sleepdata CASCADE");
};

beforeEach(() => {
  return mytruncate();
});

afterEach(() => {
  return mytruncate();
});

describe("server", () => {
  it("should be in the testing env", () => {
    const env = process.env.NODE_ENV;
    expect(env).toBe("testing");
  });
  describe("api/register POST", () => {
    it("Should return 201 on success", async () => {
      const req = await request(server)
        .post("/api/register")
        .send({
          username: "testing",
          password: "testing",
          birthdate: "04/05/1995"
        });
      expect(req.status).toBe(201);
      expect(req.type).toBe("application/json");
    });
    it("should set the role as 'users' even if it is sent in as admin", async () => {
      const req = await request(server)
        .post("/api/register")
        .send({
          username: "testing",
          password: "testing",
          birthdate: "04/05/1995",
          role: "admin"
        });
      const newUser = await db("users")
        .where("username", "testing")
        .first();
      expect(newUser.role).toEqual("user");
    });
    it("should return 400 if the username  isn't available", async () => {
      const newUser = {
        username: "testing",
        password: "testing",
        birthdate: "04/05/1995"
      };

      const req = await request(server)
        .post("/api/register")
        .send(newUser);
      const secReq = await request(server)
        .post("/api/register")
        .send(newUser);
      expect(req.status).toBe(201);
      expect(secReq.status).toBe(400);
      expect(secReq.body).toEqual({
        Error: "The username is alread taken. Please select another"
      });
    });
    it("Should return 400 if the form isn't filled out", async () => {
      const newUser = {
        password: "testing",
        birthdate: "04/05/1995"
      };
      const req = await request(server)
        .post("/api/register")
        .send(newUser);
      expect(req.status).toBe(422);
      expect(req.body).toEqual({
        Error: "The username, password, and birthdate are required"
      });
    });
  });
  describe("api/login POST", () => {
    it("should return a token and status 200 on successful login", async () => {
      const newUser = {
        username: "testing",
        password: "testing",
        birthdate: "04/05/1995"
      };
      const req = await request(server)
        .post("/api/register")
        .send(newUser);
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      expect(typeof login.body).toBe("object");
      expect(login.body).toHaveProperty("token");
      expect(login.status).toBe(200);
    });
    it("should return 401 when login fails", async () => {
      const newUser = {
        username: "testing",
        password: "testing",
        birthdate: "04/05/1995"
      };
      const req = await request(server)
        .post("/api/register")
        .send(newUser);
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "tes" });
      expect(login.status).toBe(401);
      expect(login.body).toEqual({ Error: "Invalid Credentials" });
    });
  });
});

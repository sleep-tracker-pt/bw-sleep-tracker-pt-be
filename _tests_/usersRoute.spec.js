const server = require("../api/server.js");
const request = require("supertest");
const db = require("../data/knexConfig.js");

const mytruncate = async () => {
  await db.schema.raw("TRUNCATE TABLE users CASCADE");
  await db.schema.raw("TRUNCATE TABLE sleepdata CASCADE");
};

const registerLogin = async () => {
  const newUsers = [
    {
      username: "testing",
      password: "testing",
      birthdate: "04/05/1995"
    },
    {
      username: "test",
      password: "test",
      birthdate: "02/23/2010"
    }
  ];
  const req = await request(server)
    .post("/api/register")
    .send(newUsers[0]);
  const secReq = await request(server)
    .post("/api/register")
    .send(newUsers[1]);
};

beforeEach(() => {
  return mytruncate();
});
beforeEach(() => {
  return registerLogin();
});

afterEach(() => {
  return mytruncate();
});

describe("users Router", () => {
  describe("api/users Get", () => {
    it("should return a status code of 401 for non admin", async () => {
      const user = await db("users");
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const req = await request(server)
        .get(`/api/users`)
        .set("authorize", login.body.token);
      expect(req.body).toEqual({ Error: "Unauthorized" });
    });
  });
  describe("api/user/:id GET", () => {
    "should return a status of 401 if not logged in",
      async () => {
        const user = await db("users");
        const req = await request(server).get(`/api/user/${user[0].id}`);
        expect(req.body).toEqual({ Error: "Please login / Signup" });
        expect(req.status).toBe(401);
      };
    "should return status of 400 for any user that isn't that particular user or admin",
      async () => {
        const user = await db("users");
        const login = await request(server)
          .post("/api/login")
          .send({ username: "testing", password: "testing" });
        const req = await request(server)
          .get(`/api/user/${user[1].id}`)
          .set("authorize", login.body.token);
        expect(req.body).toEqual({ Error: "Unauthorized" });
        expect(req.status).toBe(400);
      };
    "should return status 200 for authorized users",
      async () => {
        const user = await db("users");
        const login = await request(server)
          .post("/api/login")
          .send({ username: "testing", password: "testing" });
        const req = await request(server)
          .get(`/api/user/${user[0].id}`)
          .set("authorize", login.body.token);
        expect(req.body).toHaveProperty("username", user[0].username);
        expect(req.body).toHaveProperty("birthdate");
        expect(req.body).toHaveProperty("sleepdata", user[0].sleepdata);
      };
  });
  describe("api/user/:id PUT", () => {
    it("should return 401 for non logged in users", async () => {
      const user = await db("users");
      const req = await request(server)
        .put(`/api/user/${user[0].id}`)
        .send({});
      expect(req.body).toEqual({ Error: "Please login / Sign up" });
      expect(req.status).toBe(401);
    });
    it("should return 201 on successful edit", async () => {
      const user = await db("users");
      const editUser = {
        username: "tests",
        birthdate: user[0].birthdate,
        checkpassword: "testing"
      };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const secreq = await request(server)
        .put(`/api/user/${user[0].id}`)
        .set("authorize", login.body.token)
        .send(editUser);
      const users = await db("users");
      const newData = await db("users")
        .where("id", user[0].id)
        .first();
      expect(secreq.status).toBe(201);
      expect(newData).toHaveProperty("username", editUser.username);
      expect(newData).toHaveProperty("birthdate");
      expect(newData).toHaveProperty("sleepdata", editUser.sleepdata);
    });
  });
  describe("api/user/:id DELETE", () => {
    "should return 401 for users that are not admin or that particular user",
      async () => {
        const user = await db("users");
        const login = await request(server)
          .post("/api/login")
          .send({ username: "testing", password: "testing" });
        const req = await request(server)
          .del(`/api/user/${user[1].id}`)
          .set("authorize", login.body.token);
        expect(req.status).toBe(401);
        expect(req.body).toEqual({ Error: "Not Authorized" });
      };
    "should return 400 for a non logged in user",
      async () => {
        const user = await db("users");
        const req = await request(server).del(`/api/user/${user[1].id}`);
        expect(req.status).toBe(400);
        expect(req.body).toEqual({ Error: "Please login / Sign up" });
      };
    "should return 200 and number of users deleted on success",
      async () => {
        const user = await db("users");
        const login = await request(server)
          .post("/api/login")
          .send({ username: "testing", password: "testing" });
        const req = await request(server)
          .del(`/api/user/${user[0].id}`)
          .set("authorize", login.body.token);
        expect(req.status).toBe(200);
        expect(req.body).toBe(1);
      };
  });
});

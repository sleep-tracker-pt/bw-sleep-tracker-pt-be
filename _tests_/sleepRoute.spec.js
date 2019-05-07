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

describe("sleep Data route", () => {
  describe("api/sleepData POST", () => {
    it("should return 401 for unauthorized user, not the same user or admin", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[0],
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const req = await request(server)
        .post("/api/sleepData")
        .set("authorize", login.body.token)
        .send(newObj);
      expect(req.body).toEqual({ Error: "Unauthorized" });
      expect(req.status).toBe(401);
    });
    it("should return 400 for a non logged in user", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[0],
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const req = await request(server)
        .post("/api/sleepData")
        .send(newObj);
      expect(req.body).toEqual({ Error: "Please login / Sign up" });
      expect(req.status).toBe(400);
    });
    it("should return 201 for successful insert", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[0].id,
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const req = await request(server)
        .post("/api/sleepData")
        .set("authorize", login.body.token)
        .send(newObj);
      const userData = await db("sleepdata").where("userID", users[0].id);
      expect(req.status).toBe(201);
      expect(userData.length).toBe(1);
    });
  });
  describe("/api/sleepData/:id PUT", () => {
    it("should return 401 for unauthorized users, not that user or admin ", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[1].id,
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const req = await request(server)
        .put(`/api/sleepData/${users[0].id}`)
        .set("authorize", login.body.token)
        .send(newObj);
      expect(req.body).toEqual({ Error: "Unauthorized" });
      expect(req.status).toBe(401);
    });
    it("should return 400 for non logged in user", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[1].id,
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const req = await request(server)
        .put(`/api/sleepData/${users[0].id}`)
        .send(newObj);
      expect(req.body).toEqual({ Error: "Please login / Sign up" });
      expect(req.status).toBe(400);
    });
    it("should return 201 for successful update", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[0].id,
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const secObj = { ...newObj, hours: 10 };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const postreq = await request(server)
        .post("/api/sleepData")
        .set("authorize", login.body.token)
        .send(newObj);
      const sData = await db("sleepdata")
        .where("userID", users[0].id)
        .first();
      const req = await request(server)
        .put(`/api/sleepData/${sData.id}`)
        .set("authorize", login.body.token)
        .send(secObj);
      const data = await db("sleepdata").where("userID", users[0].id);
      expect(req.status).toBe(201);
      expect(data.length).toBe(1);
      expect(data[0].hours).toBe(10);
    });
    it("should return status 400 and not edit on invalid sleep night id", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[0].id,
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const secObj = { ...newObj, hours: 10 };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const postreq = await request(server)
        .post("/api/sleepData")
        .set("authorize", login.body.token)
        .send(newObj);
      const sData = await db("sleepdata")
        .where("userID", users[0].id)
        .first();
      const req = await request(server)
        .put(`/api/sleepData/-1`)
        .set("authorize", login.body.token)
        .send(secObj);
      const data = await db("sleepdata").where("userID", users[0].id);
      expect(req.status).toBe(400);
      expect(data.length).toBe(1);
      expect(data[0].hours).toBe(5);
    });
  });
  describe("/api/sleepData/:id DELETE", () => {
    it("should return 400 for non logged in user", async () => {
      const users = await db("users");
      const req = await request(server).del(`/api/sleepData/${users[0].id}`);
      expect(req.body).toEqual({ Error: "Please login / Sign up" });
      expect(req.status).toBe(400);
    });
    it("should return 401 for a unauthorized user", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[0].id,
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const req = await request(server)
        .post(`/api/sleepData/`)
        .set("authorize", login.body.token)
        .send(newObj);
      const nights = await db("sleepdata")
        .where("userID", users[0].id)
        .first();
      const secondlogin = await request(server)
        .post("/api/login")
        .send({ username: "test", password: "test" });
      const delreq = await request(server)
        .del(`/api/sleepData/${nights.id}`)
        .set("authorize", secondlogin.body.token);

      expect(delreq.body).toEqual({ Error: "Not Authorized" });
      expect(delreq.status).toBe(401);
      expect(nights).toBeTruthy();
    });
    it("should return 200 on successful deletion", async () => {
      const users = await db("users");
      const newObj = {
        userID: users[0].id,
        start: "some time",
        end: "some time",
        hours: 5,
        bed_t_rating: 2,
        work_t_rating: 3,
        average_rating: 3
      };
      const login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const req = await request(server)
        .post(`/api/sleepData/`)
        .set("authorize", login.body.token)
        .send(newObj);
      const nights = await db("sleepdata")
        .where("userID", users[0].id)
        .first();
      const delreq = await request(server)
        .del(`/api/sleepData/${nights.id}`)
        .set("authorize", login.body.token);
      const newnights = await db("sleepdata")
        .where("userID", users[0].id)
        .first();
      expect(delreq.body).toEqual([]);
      expect(newnights).toBeFalsy();
    });
  });
});

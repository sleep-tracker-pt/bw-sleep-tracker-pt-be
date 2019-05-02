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
      const user = db("users");
      login = await request(server)
        .post("/api/login")
        .send({ username: "testing", password: "testing" });
      const req = await request(server)
        .get(`/api/users`)
        .set("authorize", login.body.token);
      expect(req.body).toEqual({ Error: "Unauthorized" });
    });
  });
});

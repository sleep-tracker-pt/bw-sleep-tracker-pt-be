const users = require("../data/models/usersModel.js");
const db = require("../data/knexConfig.js");

const tUsers = [
  {
    username: "test",
    password: "testing",
    birthdate: new Date(),
    role: "user"
  },
  {
    username: "ad",
    password: "adRole",
    birthdate: new Date(),
    role: "admin"
  }
];
const mytruncate = async () => {
  await db.schema.raw("TRUNCATE TABLE users CASCADE");
  await db.schema.raw("TRUNCATE TABLE sleepdata CASCADE");
};
const seed = async () => {
  await db("users").insert(tUsers);
};

beforeEach(() => {
  return mytruncate().then(seed());
});

afterEach(() => {
  return mytruncate();
});
describe("users model", () => {
  describe("del user", () => {
    it("should del the user where the passed in id matches the user id", async () => {
      let data = await db("users");
      expect(data.length).toBe(2);
      const theUser = await db("users")
        .where("username", "test")
        .first();
      const delUser = await users.del_user(theUser.id);
      data = await db("users");
      expect(data.length).toBe(1);
      expect(delUser).toEqual(1);
    });
  });
  describe("get users", () => {
    it("should return all users in the db", async () => {
      let theUsers = await users.getUsers();
      expect(Array.isArray(theUsers)).toBe(true);
      expect(theUsers.length).toBe(2);
      expect(theUsers[0]).toHaveProperty("username", "test");
      expect(theUsers[0]).toHaveProperty("password", "testing");
      expect(theUsers[0]).toHaveProperty("role", "user");
    });
  });
  describe("single_user", () => {
    it("should return the user that matches the passed in username", async () => {
      let user = await users.single_user("test");
      expect(typeof user).toBe("object");
      expect(user).toHaveProperty("username", "test");
      expect(user).toHaveProperty("password", "testing");
      expect(user).toHaveProperty("role", "user");
    });
  });
  describe("add user", () => {
    it("should insert new users in the db", async () => {
      const data = await db("users");
      expect(data.length).toBe(2);
      expect(data[0]).toHaveProperty("username", "test");
      expect(data[0]).toHaveProperty("password", "testing");
      expect(data[0]).toHaveProperty("role", "user");
    });
    it("should default the role to user, even if none is provided", async () => {
      await users.add_user({
        username: "zach",
        password: "testing",
        birthdate: new Date()
      });
      const zach = await db("users")
        .where("username", "zach")
        .first();
      expect(zach.role).toEqual("user");
    });
  });
  describe("edit user", () => {
    it("should edit the user with the matching id", async () => {
      const newData = {
        username: "test",
        password: "testing",
        birthdate: new Date(),
        role: "user"
      };
      const editUser = await db("users")
        .where("username", "test")
        .first();
      await users.edit_user(editUser.id, newData);
      const editedUser = await db("users")
        .where("id", editUser.id)
        .first();
      expect(editedUser.username).toEqual("test");
    });
  });
});

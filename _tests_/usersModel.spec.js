const users = require("../data/models/usersModel.js");
const db = require("../data/knexConfig.js");

const testUsers = [
  {
    username: "testing",
    password: "testing",
    birthdate: new Date(),
    role: "user"
  },
  {
    username: "adRole",
    password: "adRole",
    birthdate: new Date(),
    role: "admin"
  }
];

describe("users model", () => {
  beforeEach(() => {
    return db("users").del();
  });
  describe("del user", () => {
    it("should del the user where the passed in id matches the user id", async () => {
      await db("users").insert(testUsers);
      let data = await db("users");
      expect(data.length).toBe(2);
      const theUser = await db("users")
        .where("username", "testing")
        .first();
      const delUser = await users.del_user(theUser.id);
      data = await db("users");
      expect(data.length).toBe(1);
      expect(delUser).toEqual(1);
    });
  });
  describe("get users", () => {
    it("should return all users in the db", async () => {
      await db("users").insert(testUsers);
      let theUsers = await users.getUsers();
      expect(Array.isArray(theUsers)).toBe(true);
      expect(theUsers.length).toBe(2);
      expect(theUsers[0]).toHaveProperty("username", "testing");
      expect(theUsers[0]).toHaveProperty("password", "testing");
      expect(theUsers[0]).toHaveProperty("role", "user");
    });
  });
  describe("single_user", () => {
    it("should return the user that matches the passed in username", async () => {
      await db("users").insert(testUsers);
      let user = await users.single_user("testing");
      expect(typeof user).toBe("object");
      expect(user).toHaveProperty("username", "testing");
      expect(user).toHaveProperty("password", "testing");
      expect(user).toHaveProperty("role", "user");
    });
  });
  describe("add user", () => {
    it("should insert new users in the db", async () => {
      await users.add_user(testUsers[0]);
      const data = await db("users");
      expect(data.length).toBe(1);
      expect(data[0]).toHaveProperty("username", "testing");
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
      await db("users").insert(testUsers);
      const editUser = await db("users")
        .where("username", "testing")
        .first();
      await users.edit_user(editUser.id, newData);
      const editedUser = await db("users")
        .where("id", editUser.id)
        .first();
      console.log(editedUser);
      expect(editedUser.username).toEqual("test");
    });
  });
});

const users = require("../data/models/usersModel.js");
const db = require("../data/knexConfig.js");

const testUser = {
  username: "testing",
  password: "testing",
  birthdate: new Date(),
  role: "user"
};

const testAdminRole = {
  username: "adRole",
  password: "adRole",
  birthdate: new Date(),
  role: "admin"
};

describe("users model", () => {
  beforeEach(() => {
    return db("users").truncate();
  });
	describe
});

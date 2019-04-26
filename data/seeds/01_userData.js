const faker = require("faker");
const createHash = require("../../authentication/auth.js").createHash;
const db = require("../models/usersModel.js");

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  const krisPass = "admin";
  const chrisPass = "admin";
  const adminPass = "admin";
  const krisHash = await createHash(krisPass, 10);
  const chrisHash = await createHash(chrisPass, 10);
  const adminHash = await createHash(adminPass, 10);

  let users = [
    {
      username: "Kris",
      password: krisHash,
      role: "admin"
    },
    {
      username: "Chris",
      password: chrisHash,
      role: "admin"
    },
    {
      username: "admin",
      password: adminHash,
      role: "admin"
    }
  ];
  const password = "testing";
  for (let i = 0; i < 20; i++) {
    let newObject = {
      username: faker.name.findName(),
      password: password,
      role: "users"
    };
    try {
      const hash = await createHash(password, 10);
      newObject.password = hash;
      const userCheck = await db.single_user(newObject.username);
      if (userCheck) {
        console.log("The username is alread taken. Please select another");
      } else {
        users.push(newObject);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert(users);
    });
};

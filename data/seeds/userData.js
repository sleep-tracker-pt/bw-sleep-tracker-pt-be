const faker = require("faker");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  let users = [];
  for (let i = 0; i < 20; i++) {
    const newObject = {
      username: faker.name.findName(),
      password: "testing",
      role: "user"
    };
    users.push(newObject);
  }
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert(users);
    });
};

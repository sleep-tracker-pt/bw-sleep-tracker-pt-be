const db = require("../knexConfig.js");

module.exports = {
  getUsers,
  single_user,
  single_user_by_id,
  add_user,
  edit_user,
  del_user
};

function del_user(id) {
  return db("users")
    .where("id", id)
    .del();
}

function getUsers() {
  return db("users");
}

function single_user(name) {
  return db("users")
    .where("username", name)
    .first();
}
function single_user_by_id(id) {
  return db("users")
    .where("id", Number(id))
    .first();
}

function add_user(user) {
  return db("users").insert(user);
}

function edit_user(id, user) {
  console.log(id);
  return db("users")
    .where("id", id)
    .update(user);
}

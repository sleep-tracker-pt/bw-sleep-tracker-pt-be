const db = require("../knexConfig.js");

module.exports = {
  getDataSingleUser,
  updateData,
  addSleepData
};

function getDataSingleUser(id) {
  return db("sleepData").where("userId", id);
}

function updateData(id, data) {
  return db("sleepData")
    .where("id", id)
    .update(data);
}

function addSleepData(data) {
  return db("sleepData").insert(data);
}

const db = require("../knexConfig.js");

module.exports = {
  getDataSingleUser,
  updateData,
  addSleepData,
  getSingleNight,
  delNight
};

function delNight(id) {
  return db("sleepData")
    .where("id", id)
    .del();
}

function getSingleNight(id) {
  return db("sleepData")
    .where("id", id)
    .first();
}

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

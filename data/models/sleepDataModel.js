const db = require("../knexConfig.js");

module.exports = {
  getDataSingleUser,
  updateData,
  addSleepData,
  getSingleNight,
  delNight
};

function delNight(id) {
  return db("sleepdata")
    .where("id", id)
    .del();
}

function getSingleNight(id) {
  return db("sleepdata")
    .where("id", id)
    .first();
}

function getDataSingleUser(id) {
  return db("sleepdata").where("userID", id);
}

function updateData(id, data) {
  return db("sleepdata")
    .where("id", id)
    .update(data);
}

function addSleepData(data) {
  return db("sleepdata").insert(data);
}

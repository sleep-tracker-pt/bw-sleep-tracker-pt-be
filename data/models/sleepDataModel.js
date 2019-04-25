const db = require("../knexConfig.js");

module.exports = {
  getDataSingleUser
};

function getDataSingleUser(id) {
  return db("sleepData").where("userId", id);
}

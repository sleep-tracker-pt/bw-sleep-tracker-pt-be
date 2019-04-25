const express = require("express");
const auth = require("../../authentication/auth.js");

module.exports = server => {
  server.post("/api/sleepData", auth.postAuthenticate);
  server.put("/api/sleepData/:id", auth.putAuthenticate);
  server.delete("/api/sleepData/:id", auth.delAuthenticate);
};

const express = require("express");
const cors = require("cors");
const helm = require("helmet");
const morg = require("morgan");
const authRoute = require("./routes/authentication.js");

const server = express();

server.use(helm(), express.json(), morg("dev"), cors());
authRoute(server);

// server.get("/", async (req, res) => {
//   res.send("home");
// });

module.exports = server;

const express = require("express");
const cors = require("cors");
const helm = require("helmet");
const morg = require("morgan");
const authRoute = require("./routes/authentication.js");
const usersRoute = require("./routes/usersRouter.js");

const server = express();

server.use(helm(), express.json(), morg("dev"), cors());
authRoute(server);
usersRoute(server);

// server.get("/", async (req, res) => {
//   res.send("home");
// });

module.exports = server;

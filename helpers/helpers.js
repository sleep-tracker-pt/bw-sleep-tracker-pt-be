const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtKey = process.env.JWT_SECRET || "testing";

module.exports = {
  jwtCheck
};

async function jwtCheck(tok, req, res) {
  jwt.verify(tok, jwtKey, (err, decoded) => {
    if (err) {
      res.status(401).json(err);
    }

    return (req.decoded = decoded);
  });
}

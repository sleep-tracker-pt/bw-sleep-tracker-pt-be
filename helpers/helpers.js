const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtKey = process.env.JWT_SECRET || "testing";

module.exports = {
  jwtCheck,
  createHash,
  checkHash
};

async function jwtCheck(tok, req, res) {
  jwt.verify(tok, jwtKey, (err, decoded) => {
    if (err) {
      res.status(401).json(err);
    }

    return (req.decoded = decoded);
  });
}

async function createHash(pass, salt) {
  try {
    const newHash = await new Promise((res, rej) => {
      bcrypt.hash(pass, salt, function(err, hash) {
        if (err) rej(err);
        res(hash);
      });
    });
    return newHash;
  } catch (err) {
    console.log(err);
  }
}

async function checkHash(pass, userPass) {
  try {
    const loginCheck = await new Promise((res, rej) => {
      bcrypt.compare(pass, userPass, function(err, pass) {
        if (err) rej(err);
        res(pass);
      });
    });
    return loginCheck;
  } catch (err) {
    console.log(err);
  }
}

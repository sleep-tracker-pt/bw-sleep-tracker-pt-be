const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtKey = process.env.JWT_SECRET || "testing";
const db = require("../data/models/usersModel.js");
const sleepDb = require("../data/models/sleepDataModel.js");
const helpers = require("../helpers/helpers.js");

module.exports = {
  createHash,
  checkHash,
  register,
  login,
  postAuthenticate,
  delAuthenticate,
  putAuthenticate,
  getAuthenticate,
  editUserAuthenticate,
  delUserAuthenticate,
  authAllUsers
};

async function authAllUsers(req, res) {
  const token = req.get("authorize");
  if (token) {
    const verify = await helpers.jwtCheck(token, req, res);
    try {
      if (req.decoded.role === "admin") {
        const allUsers = await db.getUsers();
        res.status(200).json(allUsers);
      } else {
        res.status(400).json({ Error: "Unauthorized" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ Error: "Please login / Sign up" });
  }
}

async function delUserAuthenticate(req, res) {
  const token = req.get("authorize");
  const { id } = req.params;
  if (token) {
    try {
      const verify = await helpers.jwtCheck(token, req, res);
      const user = await db.single_user_by_id(Number(id));
      if (user) {
        if (req.decoded.id === user.id || req.decoded.role === "admin") {
          const del = await db.del_user(Number(id));
          res.status(200).json(del);
        } else {
          res.status(401).json({ Error: "Not Authorized" });
        }
      } else {
        res.status(400).json({ Error: "The user data does not exist" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ Error: "Please login / Sign up" });
  }
}

async function delAuthenticate(req, res) {
  const token = req.get("authorize");
  const { id } = req.params;
  if (token) {
    try {
      const verify = await helpers.jwtCheck(token, req, res);
      const night = await sleepDb.getSingleNight(Number(id));
      if (night) {
        if (req.decoded.id === night.userID || req.decoded.role === "admin") {
          const del = await sleepDb.delNight(Number(id));
          res.status(200).json(del);
        } else {
          res.status(401).json({ Error: "Not Authorized" });
        }
      } else {
        res.status(400).json({ Error: "The request data does not exist" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ Error: "Please login / Sign up" });
  }
}

async function postAuthenticate(req, res) {
  const token = req.get("authorize");

  if (token) {
    const verify = await helpers.jwtCheck(token, req, res);
    try {
      const user = await db.single_user(req.decoded.username);
      const { userId } = req.body;
      if (req.decoded.id === Number(userId) || req.decoded.role === "admin") {
        const newData = await sleepDb.addSleepData(req.body);
        res.status(201).json(newData);
      } else {
        res.status(400).json({ Error: "Unauthorized" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ Error: "Please login / Sign up" });
  }
}

async function putAuthenticate(req, res) {
  const token = req.get("authorize");

  if (token) {
    const verify = await helpers.jwtCheck(token, req, res);
    try {
      const user = await db.single_user(req.decoded.username);
      const { id } = req.params;
      const { userID } = req.body;
      if (req.decoded.id === Number(userID) || req.decoded.role === "admin") {
        const updatedSleepData = await sleepDb.updateData(Number(id), req.body);
        res.status(201).json(updatedSleepData);
      } else {
        res.status(400).json({ Error: "Unauthorized" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ Error: "Please login / Sign up" });
  }
}

async function getAuthenticate(req, res) {
  const token = req.get("authorize");

  if (token) {
    const verify = await helpers.jwtCheck(token, req, res);
    try {
      const user = await db.single_user(req.decoded.username);
      const data = await sleepDb.getDataSingleUser(req.decoded.id);
      const { id } = req.params;
      if (req.decoded.id === Number(id)) {
        const theUser = { username: user.username, sleepData: data };
        res.status(200).json(theUser);
      } else if (req.decoded.role === "admin") {
        const anotherUser = await db.single_user_by_id(Number(req.params.id));
        const userData = await sleepDb.getDataSingleUser(Number(req.params.id));
        res.status(200).json({ ...anotherUser, sleepData: userData });
      } else {
        res.status(400).json({ Error: "Unauthorized" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(401).json({ Error: "Please login / Signup" });
  }
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

async function editUserAuthenticate(req, res) {
  const token = req.get("authorize");
  let creds = req.body;
  if (token) {
    const verify = await helpers.jwtCheck(token, req, res);
    const { id } = req.params;
    if (req.decoded.id === Number(id) || req.decoded.username === admin) {
      const { password, username } = req.body;
      try {
        const hash = await createHash(password, 10);
        creds.password = hash;
        console.log(creds.username, creds.password);
        const editedUser = await db.edit_user(Number(id), creds);
        console.log(editedUser);
        res.status(201).json(editedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  } else {
    res.status(400).json({ Error: "Please login / Sign up" });
  }
}

async function register(req, res) {
  const { username, password } = req.body;
  let creds = req.body;
  if (username && password) {
    try {
      const hash = await createHash(password, 10);
      creds.password = hash;
      const userCheck = await db.single_user(username);
      if (userCheck) {
        res.status(400).json({
          Error: "The username is alread taken. Please select another"
        });
      } else {
        const newUser = await db.add_user(creds);
        res.status(201).json(newUser);
      }
    } catch (err) {
      res.status(err);
    }
  } else {
    res.status(400).json({ Error: "The username and password are required" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  const creds = req.body;
  if (username && password) {
    try {
      const user = await db.single_user(username);
      if (user) {
        const loginCheck = await checkHash(password, user.password);
        if (loginCheck === true) {
          const payload = {
            id: user.id,
            username: user.username,
            role: user.role
          };
          const options = {
            expiresIn: "1d"
          };
          const token = await jwt.sign(payload, jwtKey, options);
          res.status(200).json(token);
        } else {
          res.status(401).json({ Error: "Invalid Credentials" });
        }
      } else {
        res.status(401).json({ Error: "Invalid Credentials" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ Error: "The username and password are required" });
  }
}

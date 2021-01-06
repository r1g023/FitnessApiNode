require("dotenv").config;
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateRegisterPost,
  validateLoginPost,
} = require("../middlewares/middleware-stacks");
const Users = require("../users/users-model");

//POST /api/auth/register ---> REGISTER a new user
// {username: "", password: "", email: "", role: ""}
router.post("/register", validateRegisterPost(), (req, res, next) => {
  const user = req.body;
  //hashed password into user.password
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  user.password = hashedPassword;
  //adds the username and password with hashedpassword now
  Users.addUser(user)
    .then((newUser) => {
      console.log("newUser---->", newUser);
      const token = generateToken(newUser);
      console.log("token register----->", token);
      if (newUser) {
        res.status(201).json({ new_user_created: newUser, token });
      } else {
        res.status(404).json({ cant_post_user: "Can not post the user" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

//POST /api/auth/login
// {username: "", email: ""}
router.post("/login", validateLoginPost(), (req, res, next) => {
  const credentials = req.body;

  Users.findBy({ username: credentials.username })
    .then((user) => {
      console.log("logged in user----->", user);
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        //add token to the user, use that token for authorized restricted
        const token = generateToken(user);
        res.status(201).json({
          logged_in: `welcome ${user.username}, have a cookie`,
          id: user.id,
          instructor: user.role_id === 1 ? true : false,
          token: token,
        });
      } else {
        res
          .status(401)
          .json({ no_credentials: `username and password required` });
      }
    })
    .catch((err) => {
      next(err);
    });
});

//GENERATE A TOKEN and apply to register and login
function generateToken(user) {
  //payload on token from 'users' table, only select id, username, and role
  const payload = {
    subID: user.id,
    username: user.username,
    role: user.role_id,
  };
  //options
  const options = {
    expiresIn: "1d",
  };
  //return jwt.sign
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = router;

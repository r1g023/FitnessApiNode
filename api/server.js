const express = require("express");
const router = express.Router();
const helmet = require("helmet");
const cors = require("cors");

const { logger, restrict } = require("../middlewares/middleware-stacks");

//server
const server = express();

//import routers
const welcomeRouter = require("../welcome/welcome-router");
const authRouter = require("../auth/auth-router");
const usersRouter = require("../users/users-router");
const classesRouter = require("../classes/classes-router");

//Global middleware
server.use(helmet());
server.use(cors());
server.use(logger("long"));
server.use(express.json());

//Server endpoints --------->
server.use("/", welcomeRouter);
server.use("/api/auth", authRouter);
server.use("/api/users", restrict(), usersRouter);
server.use("/api/classes", restrict(), classesRouter);

//global middleware for .catch on all endpoints
server.use((err, req, res, next) => {
  console.log("err--->", err);
  res.status(500).json({ Error: "500 Error, what happened?" });
});

module.exports = server;

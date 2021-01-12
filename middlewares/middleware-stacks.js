require("dotenv").config();
const Users = require("../users/users-model.js");
const Classes = require("../classes/classes-model");
const jwt = require("jsonwebtoken");

module.exports = {
  logger,
  checkUserID,
  checkClassID,
  userEmail,
  validateClassesPost,
  validateRegisterPost, //api/auth/register
  validateLoginPost,
  restrict, // protect user/classes endpoints
  checkRole, // if instructor
};

///Logger  short || long
function logger(format) {
  return (req, res, next) => {
    const time = new Date().toISOString();
    switch (format) {
      case "short":
        console.log(`${req.method}, ${req.url}`);
        break;
      case "long":
        console.log(
          `[${time}] -- [Ip${req.ip}] -- ${req.method} to ${
            req.url
          } from ${req.get("host")}`
        );
        break;
      default:
        return format;
    }
    //this middleware is done, move on to the next stack
    next();
  };
}

//GET /api/users/:id ---- Middleware
function checkUserID() {
  return (req, res, next) => {
    const { id } = req.params;

    Users.getUserById(id)
      .then((user) => {
        if (user) {
          // attach it to getUserById in users-router
          req.user = user;
          next();
        } else {
          res.status(401).json({ message: `no user by ID ${id} found` });
        }
      })
      .catch((err) => next(err));
  };
}

//GET /api/classes/:id ---- middleware
function checkClassID() {
  return (req, res, next) => {
    const { id } = req.params;
    Classes.getClassById(id)
      .then((classID) => {
        if (classID) {
          //pass classID onto classes by id
          req.classID = classID;
          next();
        } else {
          res.status(401).json({ message: `no class by ID #${id} found` });
        }
      })
      .catch((err) => next(err));
  };
}

//GET /api/users/:id --- if no email, error
function userEmail() {
  return (req, res, next) => {
    const { email } = req.body;
    //if no email, please enter one
    if (!email) {
      return res.json({ no_email_provided: "please enter an email" });
    }
    //send email back to user
    req.email = email;
    //next stack
    next();
  };
}

//POST /api/classes -----> if a property mispelled, then error
function validateClassesPost() {
  return async (req, res, next) => {
    const {
      name,
      type,
      class_date,
      start_time,
      duration,
      intensity,
      location,
      registered_students,
      max_students,
    } = req.body;

    !name
      ? await res.json({ message: "error, check the NAME property" })
      : !type
      ? await res.json({ message: "error, check the TYPE property" })
      : !class_date
      ? await res.json({ message: "error, check the CLASS_DATE property" })
      : !start_time
      ? await res.json({ message: "error, check the START_TIME property" })
      : !duration
      ? await res.json({ message: "error, check the DURATION property" })
      : !intensity
      ? await res.json({ message: "error, check the INTENSITY property" })
      : !location
      ? await res.json({ message: "error, check the LOCATION property" })
      : !registered_students
      ? await res.json({ message: "error, check REGISTERED_STUDENTS property" })
      : !max_students
      ? await res.json({ message: "error, check the MAX STUDENTS property" })
      : null;

    ///next middlestack and post class
    next();
  };
}

//POST /api/auth/register -----> if a property mispelled, then error
function validateRegisterPost() {
  return async (req, res, next) => {
    const { username, password, email, role_id } = req.body;

    !username
      ? await res.json({ message: "error, check Username " })
      : !password
      ? await res.json({ message: "error, check Password" })
      : !email
      ? await res.json({ message: "error, check Email " })
      : !role_id
      ? await res.json({ message: "error, check Role_Id" })
      : null;

    ///next middlestack and post class
    next();
  };
}

//POST /api/auth/login -----> if a property mispelled, then error
function validateLoginPost() {
  return async (req, res, next) => {
    const { username, password } = req.body;

    !username
      ? await res.json({ message: "error, check Username property " })
      : !password
      ? await res.json({ message: "error, check Password property" })
      : null;

    ///next middlestack and post class
    next();
  };
}

//Middleware to restrict endpoints for users and classes
function restrict() {
  return (req, res, next) => {
    // OR const token = req.cookies.token // express session does so automatically
    // set res.cookie in the generateToken function with 'cookie-parser' NPm
    // import cookie parser into server.js file, server.use(cocokieParser)
    //when a cookie gets sent out from client (insomnia, browser, etc)
    // then we can use req.cookies, instead of authorization we can do
    //req.tookies.token, get token value from cookie instead sent by client
    //This is another option to save tokens and not use authorization request
    //Example Login -: const token = generateToken(user) --- res.cookie - token
    //remove token from res.json message after login, cookie will automatically
    //handle all requests without authorizat
    const token = req.headers.authorization; // || req.cookies.token
    // see if there is a token
    //check if it is valid
    //reash the header + payload + secrete and see if it matches signature
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log("err in verify token middleware----->", err);
          res.status(401).json({ message: "correct token required" });
        } else {
          //token is valid here
          req.decodedToken = decodedToken;
          next();
        }
      });
    } else {
      res.status(401).json({
        message:
          "token invalid, not logged in, enter correct login credentials",
      });
    }
  };
}

//Middleware to check if instructor, then edit enpoint, else if student, no access
function checkRole() {
  return (req, res, next) => {
    if (req.decodedToken.role === 1) {
      //Go to next stack, and see endpoint if instructor
      next();
    } else {
      console.log("req.decodedToken.role----->", req.decodedToken.role);
      res
        .status(403)
        .json({ message: "Not authorized, you need to be an instructor" });
    }
  };
}

// STATUS CODES

// 200 = Okay - put on successful GET/PUT requests
// 201 = Object Created, put on successful POST requests
// 204 = Object Deleted, put on successful DELETE requests

// 400 = BAD REQUEST - Object missing important information, POST/PUT
// 401 = UNAUTHORIZED - Failure to Login
// 403 = FORBIDDEN - did not login, tried to access anyway
// 404 = NOT FOUND - POST/PUT/DELETE object does not exist

// 418 = I AM A TEAPOT - Do not use - but funny!

// 500 = Internal Server Error - Your fault

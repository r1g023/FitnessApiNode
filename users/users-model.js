const db = require("../database/dbConfig");

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addUser, // POST /api/auth/register
  findBy, // POST /api/auth/login
  getClassByUserId,
  addClassByUserId,
};

//USERS C.R.U.D
//GET /api/users
function getUsers() {
  return db("users")
    .join("roles", "roles.id", "=", "users.role_id")
    .select("users.id", "username", "email", "roles.role");
}

//GET -- /api/users/:id ---> get user by ID
function getUserById(id) {
  return db("users")
    .where({ id: id })
    .select("id", "username", "email", "role_id")
    .first();
}

//PATCH -- /api/users/:id ----> update user by ID EMAIL only
function updateUser(id, changes) {
  return db("users")
    .update(changes) //req.body
    .where({ id: id }) //req.params.id
    .then((ids) => {
      return db("users")
        .where({ id })
        .select("id", "username", "email")
        .first();
    });
}

//DELETE -- /api/users/:id ---> remove the user
function deleteUser(id) {
  return db("users")
    .where({ id })
    .first()
    .then((ids) => {
      return db("users").where({ id }).del();
    });
}

//GET /api/users/:id/userClasses --- get classes by each user
function getClassByUserId(userId) {
  return db("user_classes")
    .join("users", "users.id", "=", "user_classes.user_id")
    .join("classes", "classes.id", "=", "user_classes.class_id")
    .select(
      "users.id AS user_id",
      "classes.id as class_id",
      "users.username",
      "classes.start_time",
      "classes.class_date",
      "classes.duration",
      "classes.type",
      "classes.intensity",
      "classes.location"
    )
    .where({ "users.id": userId });
}

//POST /api/users/:id/joinClass - post class by each user
function addClassByUserId(userId, classBody) {
  return db("user_classes")
    .insert({ user_id: userId })
    .where("user_classes.user_id")
    .insert(classBody)
    .where("user_classes.class_id");
}

//----------------------AUTH REGISTER/LOGIN-------------------//
//------------------------------------------------------------//
//POST --  /api/auth/register ---> register a new user
function addUser(user) {
  return db("users")
    .insert(user, "id")
    .then((ids) => {
      console.log("ids--->", ids);
      return db("users").where({ id: ids }).first();
    });
}

//POST --  /api/auth/login ---> filter by 'username', login with username
//if right password
function findBy(filter) {
  //where({username: filter})
  return db("users").where(filter).orderBy("id").first();
}
//------------------------------------------------------------//
//----------------------AUTH REGISTER/LOGIN-------------------//

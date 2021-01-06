const db = require("../database/dbConfig");

module.exports = {
  getClasses,
  getClassById,
  addClass,
  updateClass,
  deleteClass,
  getUsersByClass,
};

//GET /api/classes
function getClasses() {
  return db("classes").orderBy("id");
}

//GET /api/classes/:id
function getClassById(id) {
  return db("classes").where({ id: id }).first();
}

//POST /api/classes
function addClass(changes) {
  return db("classes")
    .insert(changes)
    .returning("id")
    .then((ids) => {
      console.log("post ids----->", ids);
      return db("classes").where({ id: ids }).first();
    });
}

//PUT /api/classes/:id -- uupdate class, each property is validated
function updateClass(changes, id) {
  return db("classes")
    .update(changes) //req.body
    .where({ id }) //req.params.id
    .then((ids) => {
      return db("classes").where({ id }).first();
    });
}

// DELETE /api/class/:id ----> delete a class
function deleteClass(id) {
  return db("classes").where({ id }).delete();
}

//GET /api/classes/:id/users
function getUsersByClass(id) {
  return db("user_classes")
    .where({ class_id: id })
    .join("users", "users.id", "user_classes.user_id")
    .join("classes", "classes.id", "=", "user_classes.class_id")
    .join("roles", "roles.id", "=", "users.role_id")
    .select(
      "user_classes.user_id",
      "users.username",
      "roles.role",
      "users.email",
      "classes.id as classes_id"
    )
    .orderBy("user_classes.user_id");
}

//DELETE

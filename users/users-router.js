const express = require("express");
const router = express.Router();
const Users = require("./users-model");
const Classes = require("../classes/classes-model");
const { checkUserID, userEmail } = require("../middlewares/middleware-stacks");

// getUsers, getUserById, updateUser, deleteUser, ||||| addUser, findBy,

//GET /api/users
router.get("/", (req, res, next) => {
  console.log("req.decodedToken----->", req.decodedToken);
  Users.getUsers()
    .then((user) => {
      user
        ? res.status(200).json(user)
        : res.status(404).json({ message: `no users found` });
    })
    .catch((err) => next(err));
});

//GET /api/users/:id
router.get("/:id", checkUserID(), (req, res, next) => {
  //import user from middleware-stacks
  res.status(200).json(req.user);
});

//PATCH /api/users/:id ---> can only update the email address
router.patch("/:id", checkUserID(), userEmail(), (req, res, next) => {
  const { id } = req.params;
  // Id first, changes second, only updating the email through middle
  Users.updateUser(id, { email: req.email })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => next(err));
});

//DELETE /api/users/:id --> delete the user
router.delete("/:id", checkUserID(), (req, res, next) => {
  const { id } = req.params;
  Users.deleteUser(id)
    .then((user) => {
      res.status(204).json(user);
    })
    .catch((err) => next(err));
});

//GET /api/users/:id/userClasses -- get classes by each user
router.get("/:id/userClasses", checkUserID(), (req, res, next) => {
  const { id } = req.params;
  Users.getClassByUserId(id)
    .then((user) => {
      res.status(200).json({ list_of_classes: user });
    })
    .catch((err) => next(err));
});

//POST /api/users/:id/joinClass
router.post("/:id/joinClass", checkUserID(), (req, res, next) => {
  const { id } = req.params;
  const newPost = req.body;
  console.log("User id = ", id, "newPost---> =", newPost);
  Users.addClassByUserId(id, newPost)
    .then((clasz) => {
      res.status(201).json({
        class_added_to_user: `class added to user_id: ${id}`,
        newPost,
      });
    })

    .catch((err) => next(err));
});

module.exports = router;

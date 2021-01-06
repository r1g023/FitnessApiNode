const express = require("express");
const router = express.Router();
const Classes = require("./classes-model");
const {
  checkClassID,
  validateClassesPost,
  checkRole,
} = require("../middlewares/middleware-stacks");

// GET /api/classes ----> get list of classes
router.get("/", (req, res, next) => {
  console.log("req.decodedToken.role----->", req.decodedToken.role);
  Classes.getClasses()

    .then((classes) => {
      res.status(200).json(classes);
    })
    .catch((err) => next(err));
});

//GET /api/classes/:id -----> get class by ID
router.get("/:id", checkClassID(), (req, res, next) => {
  res.status(200).json(req.classID);
});

//POST /api/classes ----> post a class
router.post("/", checkRole(), (req, res, next) => {
  const newPost = req.body;
  //validateClassesPost middleware to verify each and every property
  Classes.addClass(newPost)
    .then((newClass) => {
      console.log("newClass post--->", newPost);
      newClass
        ? res.status(201).json({ new_class_posted: newClass })
        : res.status(401).json({ err: `Error, can't post class ${newClass}` });
    })
    .catch((err) => next(err));
});

//PUT /api/classes/:id
router.put(
  "/:id",
  checkRole(),
  checkClassID(),
  validateClassesPost(),
  (req, res, next) => {
    const { id } = req.params;
    const changes = req.body;
    Classes.updateClass(changes, id)
      .then((results) => {
        results
          ? res.status(200).json({ class_updated: results })
          : res.status(404).json({ error: "error updating class" });
      })
      .catch((err) => next(err));
  }
);

//DELETE /api/classes/:id
router.delete("/:id", checkRole(), checkClassID(), (req, res, next) => {
  const { id } = req.params;

  Classes.deleteClass(id)
    .then((deleted) => {
      res.status(204).json({ message: "deleted", deleted });
    })
    .catch((err) => next(err));
});

//GET /api/classes/:id/users
router.get("/:id/users", checkClassID(), (req, res, next) => {
  const { id } = req.params;

  Classes.getUsersByClass(id)
    .then((classes) => {
      res.status(201).json({
        class_added_to_user: `class added to user_id: ${id}`,
        classes,
      });
    })
    .catch((err) => next(err));
});

module.exports = router;

exports.seed = function (knex) {
  return knex("roles").insert([
    { id: 1, role: "instructor" },
    { id: 2, role: "student" },
  ]);
};

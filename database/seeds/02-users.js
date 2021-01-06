const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
  return knex("users").insert([
    {
      username: "Valeriy",
      password: bcrypt.hashSync("test1", 10),
      email: "valeriy@lambdastudents.com",
      role_id: 2,
    },
    {
      username: "Sarah",
      password: bcrypt.hashSync("test2", 10),
      email: "sarah@lambdastudents.com",
      role_id: 2,
    },
    {
      username: "Andrew",
      password: bcrypt.hashSync("test3", 10),
      email: "andrew@lambdastudents.com",
      role_id: 2,
    },
    {
      username: "Caleb",
      password: bcrypt.hashSync("test4", 10),
      email: "caleb@lambdastudents.com",
      role_id: 1,
    },
    {
      username: "Rigo",
      password: bcrypt.hashSync("test5", 10),
      email: "rigo@lambdastudents.com",
      role_id: 1,
    },
  ]);
};

exports.up = function (knex) {
  return (
    knex.schema
      //roles either instructor or student
      .createTable("roles", (tbl) => {
        tbl.increments();
        tbl.string("role", 128).notNull();
      })
      //users
      .createTable("users", (tbl) => {
        tbl.increments();
        tbl.string("username", 128).notNull().unique();
        tbl.string("password", 128).notNull();
        tbl.string("email", 128).notNull().unique();
        tbl
          .bigInteger("role_id") // student or instructor
          .unsigned()
          .notNull()
          .references("roles.id") // || .inTable("roles")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
      })
      //classes
      .createTable("classes", (tbl) => {
        tbl.increments();
        tbl.string("name", 128).notNull();
        tbl.string("type", 128).notNull();
        tbl.string("class_date").notNull();
        tbl.string("start_time", 128).notNull();
        tbl.decimal("duration").notNull();
        tbl.string("intensity", 128).notNull();
        tbl.string("location", 128).notNull();
        tbl.integer("registered_students").notNull();
        tbl.integer("max_students").notNull();
        tbl.timestamps(true, true); // no need to request from body
      })
      //user classes and join classes by user
      .createTable("user_classes", (tbl) => {
        tbl
          .integer("user_id")
          .unsigned()
          .notNull()
          .references("users.id") // ||.inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        tbl
          .integer("class_id")
          .unsigned()
          .notNull()
          .references("classes.id") // ||.inTable("classes")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        tbl.primary(["user_id", "class_id"]);
      })
  );
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("user_classes")
    .dropTableIfExists("classes")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};

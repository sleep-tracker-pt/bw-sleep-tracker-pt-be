exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", tb => {
    tb.increments();
    tb.string("username", 128)
      .notNullable()
      .unique();
    tb.string("password", 255).notNullable();
    tb.string("role", 128)
      .notNullable()
      .defaultTo("user");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};

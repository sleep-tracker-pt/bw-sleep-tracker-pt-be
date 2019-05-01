exports.up = function(knex, Promise) {
  return knex.schema.createTable("sleepdata", tb => {
    tb.increments();
    tb.integer("userID")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tb.string("start").notNullable();
    tb.string("end").notNullable();
    tb.integer("hours").notNullable();
    tb.integer("scale").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.dropTableIfExists("sleepdata");
};

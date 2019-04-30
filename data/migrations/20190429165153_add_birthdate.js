exports.up = function(knex, Promise) {
  return knex.schema.table("users", tb => {
    tb.date("birthdate").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("users", tb => {
    tb.dropColumn("birthdate");
  });
};

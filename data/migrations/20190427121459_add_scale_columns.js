exports.up = function(knex, Promise) {
  return knex.schema.table("sleepData", tb => {
    tb.dropColumn("scale");
    tb.string("bed_t_rating");
    tb.string("work_t_rating");
    tb.string("average_rating");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("sleepData", tb => {
    tb.dropColumn("bed_t_rating");
    tb.dropColumn("work_t_rating");
    tb.dropColumn("average_rating");
    tb.string("scale");
  });
};

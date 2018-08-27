
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks', (table) => {
    table.string('id', 36).unsigned().primary();
    table.string('remark').nullable();
    table.string('state', 50).defaultTo('NEW');
    table.integer('progress').defaultTo(0); // Used for nested task
    table.boolean('completed').notNullable().defaultTo(false);
    table.timestamp('start_time').nullable();
    table.timestamp('end_time').nullable();
    table.integer('urgency').defaultTo(3); // 0 - VVU, 1 - VU, 2 - U, 3 - NU
    table.foreign('id').references('posts.id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks');
};

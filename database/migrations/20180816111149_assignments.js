
exports.up = function(knex, Promise) {
  return knex.schema.createTable('assignments', (table) => {
    table.string('id', 36).primary();
    table.string('post_id', 36).unsigned();
    table.string('group_id', 36).nullable();
    table.string('user_id', 36).notNullable()
    table.string('role', 20).defaultTo('ASSIGNEE'); // ASSIGNEE - Need to be done by, VIEWER - Watch the task progress,  
    table.integer('progress').defaultTo(0);
    table.string('state', 50).defaultTo('NEW');
    table.boolean('completed').notNullable().defaultTo(false);
    table.timestamp('start_time').nullable();
    table.timestamp('end_time').nullable();
    table.integer('urgency').defaultTo(3); // 0 - VVU, 1 - VU, 2 - U, 3 - NU
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('created_by').nullable();
    table.timestamp('updated_at').nullable();
    table.string('updated_by').nullable();
    table.foreign('post_id').references('posts.id');
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.droptTable('assignments');
}

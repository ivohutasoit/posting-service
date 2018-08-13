
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks', (table) => {
    table.string('id', 36).unsigned().primary()
    table.string('remark').nullable()
    table.string('state', 50).defaultTo('NEW')
    table.boolean('completed').notNullable().defaultTo(false)
    table.timestamp('start_time').nullable()
    table.timestamp('end_time').nullable()
    table.integer('urgency').defaultTo(3) // 0 - VVU, 1 - VU, 2 - U, 3 - NU
    table.boolean('is_deleted').notNullable().defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('created_by').nullable()
    table.timestamp('updated_at').nullable()
    table.string('updated_by').nullable()
    table.foreign('id').references('posts.id')  
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks')
};

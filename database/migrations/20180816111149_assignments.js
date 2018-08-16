
exports.up = function(knex, Promise) {
  return knex.schema.createTable('assignments', (table) => {
    table.string('id', 36).primary()
    table.string('task_id', 36).unsigned()
    table.string('user_id', 36).notNullable()
    table.string('role', 20).defaultTo('ASSIGNEE') // ASSIGNEE - Need to be done by, VIEWER - Watch the task progress,  
    table.boolean('is_deleted').notNullable().defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('created_by').nullable()
    table.timestamp('updated_at').nullable()
    table.string('updated_by').nullable()
    table.foreign('task_id').references('tasks.id')  
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.droptTable('assignments')
}

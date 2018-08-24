
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', (table) => {
    table.string('id', 36).primary()
    table.string('parent_id', 36).nullable()
    table.string('class', 50).notNullable().defaultTo('POST')
    table.string('category_id', 36).unsigned()
    table.string('group_id', 36).nullable()
    table.string('title', 100).notNullable()
    table.string('content').nullable()
    table.boolean('is_deleted').notNullable().defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('created_by').nullable()
    table.timestamp('updated_at').nullable()
    table.string('updated_by').nullable()
    table.foreign('category_id').references('categories.id')  
    table.foreign('parent_id').references('posts.id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts')
};


exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', (table) => {
    table.string('id', 36).primary()
    table.string('class', 50).notNullable().defaultTo('POST')
    table.string('code', 20).notNullable()
    table.string('description').nullable()
    table.string('value', 100).nullable()
    table.boolean('is_system').notNullable().defaultTo(false)
    table.boolean('is_active').notNullable().defaultTo(false)
    table.boolean('is_deleted').notNullable().defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('created_by').nullable()
    table.timestamp('updated_at').nullable()
    table.string('updated_by').nullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories')
};

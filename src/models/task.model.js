'use strict'

const { Model } = require('objection');
const { Connection } = require('../configurations');

Model.knex(Connection.database);

/**
 * Task model
 * @author Ivo Hutasoit
 * @since 1.1.0
 */
class Task extends Model {
  static get tableName() { return 'tasks'; }
}

module.exports = Task;
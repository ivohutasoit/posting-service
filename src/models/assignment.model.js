'use strict'

const { Model } = require('objection');
const { Connection } = require('../configurations');

Model.knex(Connection.database);

/**
 * Assignments
 * 
 * @author Ivo Hutasoit <if09051@gmail.com>
 * @since 1.1.0
 */
class Assignment extends Model {
    static get tableName() { return 'assignments'; }

    async $beforeUpdate() {
      this.updated_at = Connection.database.fn.now();
    }
}
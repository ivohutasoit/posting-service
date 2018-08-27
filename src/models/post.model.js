'use strict'

const { Model } = require('objection');
const { Connection } = require('../configurations');

Model.knex(Connection.database);

/**
 * Post model
 * @author Ivo Hutasoit
 * @since 1.1.0
 */
class Post extends Model {
  static get tableName() { return 'posts'; }

  async $beforeUpdate() {
    this.updated_at = Connection.database.fn.now();
  }
}

module.exports = Post;
'use strict'

const environment = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const database = require('./database')[environment];

/**
 * @since 1.0.0
 */
module.exports = {
  database: require('knex')(database)
};
'use strict'

const environment = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const database = require('./database')[environment]

module.exports = {
    database: require('knex')(database)
}
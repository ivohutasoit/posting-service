'use strict'

const connection = require('../configurations/connection')

const database = connection['database']

function list() {
  return database('categories').select().catch((error) => { throw error })
}
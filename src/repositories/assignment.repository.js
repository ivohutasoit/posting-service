'use strict'

const database = require('../configurations/connection')['database']

/**
 * 
 * @param {String} id 
 */
function findById(id) {
  return database('assignments').where({ id: id, is_deleted: false })
    .first().catch((error) => { throw error })
}

/**
 * 
 * @param {Object} assignData 
 */
function create(assignData) {
  return database('assignments').insert(assignData).then((data) => {
    if(!data) throw new Error('Unable to create assignment')
    return findById(assignData.id)
  }).catch((error) => { throw error })
}

module.exports = {
  findById,
  create
}
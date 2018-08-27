'use strict'

const database = require('../configurations/connection')['database']

/**
 * @deprecated since version 1.1.0
 * @param {String} id 
 */
function findById(id) {
  return database('assignments').where({ id: id, is_deleted: false })
    .first().catch((error) => { throw error })
}

/**
 * @deprecated since version 1.1.0
 * @param {Object} assignData 
 */
function create(assignData) {
  return database('assignments').insert(assignData).then((data) => {
    if(!data) throw new Error('Unable to create assignment')
    return findById(assignData.id)
  }).catch((error) => { throw error })
}

/**
 * @deprecated since version 1.1.0
 * @since 1.0.0
 */
module.exports = {
  findById,
  create
}
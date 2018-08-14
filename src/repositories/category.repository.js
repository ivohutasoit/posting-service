'use strict'

const database = require('../configurations/connection')['database']

/**
 * 
 */
function list() {
  return database('categories').where({ is_deleted: false }).select().catch((error) => { throw error })
}

/**
 * 
 * @param {String} userId 
 */
function findByUserId(userId) {
  return database('categories').where({ created_by: userId, is_deleted: false })
    .select('id', 'type', 'code', 'description', 'value').catch((error) => { throw error })
}

/**
 * 
 * @param {String} userId 
 */
function findTaskClassByUserId(userId) {
  return database('categories').where({ class: 'TASK', created_by: userId, is_deleted: false })
    .select('id', 'class', 'code', 'description', 'value').catch((error) => { throw error })
}

/**
 * 
 * @param {String} id 
 */
function findById(id) {
  return database('categories').where({ id: id, is_deleted: false }).first().catch((error) => { throw error })
}

/**
 * 
 * @param {Object} categoryData 
 */
function create(categoryData) {
  return database('categories').insert(categoryData).then((data) => {
    if(!data) throw new Error('Unable to create category')
    return findById(categoryData.id)
  }).catch((error) => { throw error })
}

module.exports = {
  list, findByUserId, findTaskClassByUserId, findById,
  create
}
'use strict'

const database = require('../configurations/connection')['database']

/**
 * 
 * @param {String} id 
 */
function findById(id) {
  return database('posts').where({ id: id, is_deleted: false }).first().catch((error) => { throw error })
}

/**
 * 
 * @param {Object} postData 
 */
function create(postData) {
  return database('posts').insert(postData).then((data) => {
    if(!data) throw new Error('Unable to create post')
    return findById(postData.id)
  }).catch((error) => { throw error })
}

function update(postData) {
  postData.updated_at = database.fn.now()
  return database('posts').where({ id: postData.id, is_deleted: false })
    .update(postData).then((data) => {
      return findById(postData.id)
    }).catch((error) => { throw error })
}

module.exports = {
  findById,
  create, update
}
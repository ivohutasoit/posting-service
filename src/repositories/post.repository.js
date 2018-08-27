'use strict'

const database = require('../configurations/connection')['database']

/**
 * @deprecated since version 1.1.0
 * @param {String} id 
 */
function findById(id) {
  return database('posts').where({ id: id, is_deleted: false }).first().catch((error) => { throw error })
}

/**
 * @deprecated since version 1.1.0
 * @param {Object} postData 
 */
function create(postData) {
  return database('posts').insert(postData).then((data) => {
    if(!data) throw new Error('Unable to create post')
    return findById(postData.id)
  }).catch((error) => { throw error })
}

/**
 * @deprecated since version 1.1.0
 * @param {Object} postData 
 */
function update(postData) {
  postData.updated_at = database.fn.now()
  return database('posts').where({ id: postData.id, is_deleted: false })
    .update(postData).then((data) => {
      return findById(postData.id)
    }).catch((error) => { throw error })
}

/**
 * @deprecated since version 1.1.0
 * @since 1.0.0
 */
module.exports = {
  findById,
  create, update
}
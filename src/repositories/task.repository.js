'use strict' 

const database = require('../configurations/connection')['database']

function findByUserId(userId) {
  return database('tasks').where({ created_by: userId, is_deleted: false })
    .orderBy('created_at', 'desc')
    .select().catch((error) => { throw error })

  /* return database('posts').join('tasks', 'tasks.id', 'posts.id')
    .where({ 'posts.created_by': userId, 'posts.is_deleted': false })
    .select('posts.id', 'posts.title', 'posts.content', 'tasks.remark', 'tasks.state',
      'tasks.completed', 'tasks.urgency')
    .catch((error) => { throw error }) */
}

/**
 * 
 * @param {String} id 
 */
function findById(id) {
  return database('tasks').where({ id: id, is_deleted: false }).first().catch((error) => { throw error })
}

/**
 * 
 * @param {Object} taskData 
 */
function create(taskData) {
  return database('tasks').insert(taskData).then((data) => {
    if(!data) throw new Error('Unable to create task')
    return findById(taskData.id)
  }).catch((error) => { throw error })
}

/**
 * 
 * @param {Object} taskData 
 */
function update(taskData) {
  return database('tasks').where({ id: taskData.id, created_by: taskData.created_by, is_deleted: false })
    .update(taskData).then((data) => {
      return findById(taskData.id)
    }).catch((error) => { throw error })
}

module.exports = {
  findByUserId, findById,
  create, update
}
'use strict' 

const database = require('../configurations/connection')['database']

function findByUserId(userId) {
  /* return database('tasks').where({ created_by: userId })
    .orderBy('created_at', 'desc')
    .select().catch((error) => { throw error }) */

  return database('posts').join('tasks', 'tasks.id', 'posts.id')
    .where({ 'posts.created_by': userId, 'posts.is_deleted': false, 'posts.class': 'TASK' })
    .select('posts.id', 'posts.category_id', 'posts.title', 'tasks.state',
      'tasks.completed', 'tasks.urgency')
    .orderBy('posts.created_at', 'asc')
    .catch((error) => { throw error })
}

/**
 * 
 * @param {String} id 
 */
function findById(id) {
  /* return database('tasks').where({ id: id }).first().catch((error) => { throw error }) */
  return database('posts').join('tasks', 'tasks.id', 'posts.id')
    .where({ 'posts.id': id, 'posts.is_deleted': false, 'posts.class': 'TASK' })
    .select('posts.id', 'posts.category_id', 'posts.title', 'tasks.state',
      'tasks.completed', 'tasks.urgency')
    .first()
    .catch((error) => { throw error })
}

function findByIdAndCreatorId(id, creator_id) {
  return database('posts').join('tasks', 'tasks.id', 'posts.id')
    .where({ 'posts.id': id, 'posts.created_by': creator_id, 'posts.is_deleted': false, 'posts.class': 'TASK' })
    .select('posts.id', 'posts.category_id', 'posts.title', 'tasks.state',
      'tasks.completed', 'tasks.urgency', 'posts.created_by')
    .first()
    .catch((error) => { throw error })
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
  return database('tasks').where({ id: taskData.id })
    .update(taskData).then((data) => {
      return findById(taskData.id)
    }).catch((error) => { throw error })
}

module.exports = {
  findByUserId, findById, findByIdAndCreatorId,
  create, update
}
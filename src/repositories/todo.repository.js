'use strict'

const database = require('../configurations/connection')['database']

function findByUserId(userId) {
  return database('posts').join('tasks', 'tasks.id', 'posts.id')
    .where({ 'posts.created_by': userId, 'posts.is_deleted': false, 'posts.class': 'TASK' })
    .select('posts.id', 'posts.category_id', 'posts.title', 'tasks.state',
      'tasks.completed', 'tasks.urgency')
    .orderBy('posts.created_at', 'asc')
    .catch((error) => { throw error })
}

module.exports = {
  findByUserId
}
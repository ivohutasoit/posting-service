'use strict'

const { Category, Post, Task } = require('../models');

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function list(ctx) {
  try {
    const ownTasks = await Task.query()
          .join('posts', 'tasks.id', 'posts.id')
          .leftJoin('categories', 'posts.category_id', 'categories.id')
          .where('posts.created_by', ctx.state.user.id)
          .andWhere('posts.is_deleted', false)
          .andWhere('posts.class', 'TASK')
          .andWhereRaw('posts.group_id IS ?', [null])
          .andWhereRaw('posts.parent_id IS ?', [null])
          .select('posts.id', 'categories.id as category_id', 'categories.code as category_code', 'posts.title' ,
            'tasks.remark', 'tasks.state', 'tasks.progress', 'tasks.completed', 'tasks.start_time', 'tasks.end_time', 'tasks.urgency')
          .orderBy('posts.created_at', 'asc');

    const groupOwnCreatedTasks = await Task.query()
          .join('posts', 'tasks.id', 'posts.id')
          .leftJoin('categories', 'posts.category_id', 'categories.id')
          .where('posts.created_by', ctx.state.user.id)
          .andWhere('posts.is_deleted', false)
          .andWhere('posts.class', 'TASK')
          .andWhereRaw('posts.group_id IS NOT ?', [null])
          .andWhereRaw('posts.parent_id IS ?', [null])
          .select('posts.id', 'posts.group_id', 'posts.title', 'tasks.remark', 'tasks.state', 'tasks.progress', 
            'tasks.completed', 'tasks.start_time', 'tasks.end_time', 'tasks.urgency', 'posts.created_at')
          .orderBy('posts.created_at', 'asc');
    ctx.status = 200;
    ctx.body = {
      status: 'SUCCESS',
      data: {
        own_tasks: ownTasks !== undefined ? ownTasks : [],
        group_tasks: groupOwnCreatedTasks !== undefined ? groupOwnCreatedTasks : []
      }
    };
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' ,message: err.message || 'Error while getting tasks' };
  }
}

/**
 * @since 1.1.0
 */
module.exports = {
  list
};
'use strict'

const { transaction } = require('objection');

const { Category, Post, Task } = require('../models');

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function create(ctx) {
  const req = ctx.request.body;
  if(req.assign_type === 'CATEGORY') {
    return assignToCategory(ctx);
  } else if(req.assign_type === 'GROUPMEMBER') {
    return toGroupMember(ctx);
  }
}

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function assignToCategory(ctx) {
  try {
    const req = ctx.request.body;
    const task = await transaction(Post, Task, async(Post, Task) => {
      await Post.query()
        .update({
          category_id: req.assign_to,
          updated_by: ctx.state.user.id
        }).where('id', req.task_id);
      
      if(req.remark) {
        await Task.query()
          .update({
            remark: req.remark
          }).where('id', req.task_id);
      }

      var data = await Task.query()
            .join('posts', 'posts.id', 'tasks.id')
            .leftJoin('categories', 'categories.id', 'posts.category_id')
            .where('posts.id', req.task_id)
            .andWhere('posts.is_deleted', false)
            .andWhere('posts.class', 'TASK')
            .select('posts.id', 'categories.id as category_id', 'categories.code as category_code', 
                    'posts.title', 'tasks.remark', 'tasks.state', 'tasks.progress', 'tasks.completed', 'tasks.start_time', 
                    'tasks.end_time', 'tasks.urgency', 'posts.created_at', 'posts.created_by', 'posts.updated_at', 
                    'posts.updated_by')
            .first();

      return {
        id: data.id, 
        category: { id: data.category_id, code: data.category_code }, 
        title: data.title, 
        remark: data.remark,
        state: data.state, 
        progress: data.progress, 
        complete: data.complete, 
        start_time: data.start_time, 
        end_time: data.end_time,
        urgency: data.urgency, 
        created_at: data.created_at, 
        updated_at: data.updated_at
      };
    });
    ctx.state = 200;
    ctx.body = { status: 'SUCCESS', data: task };
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' , message: err.message || 'Error while getting tasks' };
  }
}

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function toGroupMember(ctx) {
  try {
    
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' , message: err.message || 'Error while getting tasks' };
  }
}

/**
 * @since 1.1.0
 */
module.exports = {
  create
};
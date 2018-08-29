'use strict'

const request = require('request-promise');

const { Assignment, Category, Task } = require('../models');

/**
 * @since 1.1.0
 * @param {Object} ctx 
 * @param {function} next callback 
 */
async function validateCreate(ctx, next) {
  const req = ctx.request.body;
  var valid = true;
  var messages = { };
  // Check Task
  if(!req.task_id) {
      if(valid) valid = false;
      messages.task_id = 'required';
  } 
  if(!req.assign_to) {
      if(valid) valid = false;
      messages.assign_to = 'required';
  }
  if(req.task_id && req.assign_to) {
    const task = await Task.query()
                      .join('posts', 'posts.id', 'tasks.id')
                      .where('posts.id', req.task_id)
                      .andWhere('class', "TASK")
                      .andWhere('posts.created_by', ctx.state.user.id)
                      .andWhere('posts.is_deleted', false)
                      .select('posts.id', 'posts.category_id', 'posts.group_id', 'tasks.state',
                          'tasks.completed', 'posts.created_by')
                      .first();
    if(task) {
      if(!task.group_id) { // Personal Task
        // Check Category
        const category = await Category.query()
          .where('id', req.assign_to)
          .andWhere('class', 'TASK')
          .andWhere('is_deleted', false)
          .andWhere('created_by', ctx.state.user.id)
          .andWhereRaw('group_id IS NULL')
          .first();
        if(!category) {
          if(valid) valid = false;
          messages.assign_to = 'not found';
        } else {
          ctx.request.body.assign_type = 'CATEGORY';
        }
      } else { // Group Task
        if(task.completed === 1) {
          if(valid) valid = false;
          messages.user_id = 'already completed';
        } else if(task.created_by !== ctx.state.user.id) {
          // 1. Check assigner user if can assign or not
          // 1.1. Author (creator)
          if(valid) valid = false;
          messages.user_id = 'access denied';
        } else {
          // 2. Check assignee user if already assigned
          const assignment = await Assignment.query()
            .where('post_id', task.id)
            .andWhere('group_id', task.group_id)
            .andWhere('user_id', req.user_id)
            .andWhere('completed', false)
            .andWhere('is_deleted', false)
            .first();
          if(assignment) {
            if(valid) valid = false;
            messages.user_id = 'already assigned';
          } else {
            
          }
        }
      }
    } else {
      if(valid) valid = false;
      messages.task_id = 'not found';
    }
  }
  if(!valid) {
    if(!req.remark) {
      messages.remark = 'optional';
    }
    ctx.status = 400
    ctx.body = {
      status: 'ERROR',
      messages: messages
    }
    return ctx;
  } 
  return next();
}

/**
 * @since 1.1.0
 */
module.exports = {
  validateCreate
};
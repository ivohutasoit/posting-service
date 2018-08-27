'use strict'

const request = require('request-promise');
const { Category, Post, Task } = require('../models');

const categoryRepository = require('../repositories/category.repository')
const taskRepository = require('../repositories/task.repository')

/**
 * @since 1.0.0
 * @param {Object} ctx 
 * @param {function} next callback
 */
async function validateCreate(ctx, next) {
  const req = ctx.request.body;
  var valid = true;
  var messages = { };
  if(!req.title) {
    if(valid) valid = false;
    messages.title = 'required';
  }

  if(req.category_id) {
    const category = await Category.query()
      .where('id', req.category_id)
      .andWhere('created_by', ctx.state.user.id)
      .andWhere('is_deleted', false)
      .first();
    if(!category) {
      if(valid) valid = false;
      messages.category_id = 'Not found';
    }
  }

  if(!valid) {
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
 * @param {Object} ctx 
 * @param {function} next callback
 */
async function validateComplete(ctx, next) {
  const req = ctx.request.body;
  var valid = true;
  var messages = { };
  if(!req.id) {
    if(valid) valid = false;
    messages.id = 'required';
  } else {
    const task = await Task.query()
      .join('posts', 'posts.id', 'tasks.id')
      .where('posts.id', req.id)
      .andWhere('posts.is_deleted', false)
      .select('posts.id', 'posts.category_id', 'posts.group_id', 'tasks.state',
        'tasks.completed', 'posts.created_by')
      .first();

    if(task) {
      if(ctx.state.user.id !== task.created_by) {
        if(valid) valid = false;
        messages.id = 'access denied';
      } else if(task.completed === 1) {
        if(valid) valid = false;
        messages.id = 'already completed';
      }
    } else {
      if(valid) valid = false;
        messages.id = 'not found';
    }
  }

  if(!valid) {
    messages.remark = 'optional';
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
 * @param {Object} ctx 
 * @param {function} next callback
 */
async function validateAssignment(ctx, next) {
  const req = ctx.request.body;
  var valid = true;
  var messages = { };
  // Check Task ID
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
      .andWhere('posts.is_deleted', false)
      .select('posts.id', 'posts.category_id', 'posts.group_id', 'tasks.state',
        'tasks.completed', 'posts.created_by')
      .first();

    if(task) {
      if(task.group_id) {
        // Check User Relationship, if assign to user
        if(task.completed === 1) {
          if(valid) valid = false;
          messages.task_id = 'already completed';
        } else {
          const uri = process.env.API_RELATION_URI || 'http://localhost:5000/api/v1';
          const options = {
            method: 'GET',
            uri: uri + "/group/" + task.group_id,
            json: true,
            headers: {
              authorization: `Bearer ${ctx.headers.authorization.split(' ')[1]}`,
            }
          };
          
          await request(options).then((res) => {
            ctx.request.body.assign_type = 'GROUPMEMBER';
          }).catch((err) => { 
            console.log(err);
            if(valid) valid = false;
            messages.task_id = err.message || 'Error while getting tasks';
          });
        }
      } else {
        if(ctx.state.user.id !== task.created_by) {
          if(valid) valid = false;
          messages.task_id = 'access denied';
        } else {
          const category = await Category.query()
            .where('id', req.assign_to)
            .andWhere('class', 'TASK')
            .andWhere('is_deleted', false)
            .andWhere('created_by', ctx.state.user.id)
            .andWhereRaw('group_id IS NULL')
            .first();
          if(!category) {
            if(valid) valid = false;
            messages.assign_to = 'category or relation was not found';
          } else {
            ctx.request.body.assign_type = 'CATEGORY';
          }
        }
      }
    } else {
      if(valid) valid = false;
      messages.task_id = 'not found';
    }
  }

  // Check category, if assign to category

  if(!valid) {
    messages.remark = 'optional';
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
 * @since 1.0.0
 */
module.exports = {
  validateCreate, validateComplete, validateAssignment
};
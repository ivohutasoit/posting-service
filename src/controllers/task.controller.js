'use strict'

const lodash = require('lodash');
const { transaction } = require('objection');
const uuid = require('uuid/v1');

const { Category, Post, Task } = require('../models');

//#region Task Category

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function createCategory(ctx) {
  try {
    const category = await Category.query().insert({
      id: uuid(),
      class: 'TASK',
      code: ctx.request.body.code.toUpperCase(),
      is_active: true,
      description: lodash.startCase(ctx.request.body.description),
      created_by: ctx.state.user.id
    });
    if(category) {
      ctx.status = 201
      ctx.body = {
        status: 'SUCCESS',
        data: {
          id: category.id,
          class: category.class,
          code: category.code,
          description: category.description
        }
      }
    }
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' ,message: err.message || 'Error while getting tasks' };
  }
}

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function listCategory(ctx) {
  try {
    const categories = await Category.query()
            .where('class', 'TASK')
            .andWhere('created_by', ctx.state.user.id)
            .andWhere('is_deleted', false)
            .select('id', 'code', 'description');
    ctx.status = 200;
    ctx.body = {
      status: 'SUCCESS',
      data: categories !== undefined ? categories : []
    };
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' ,message: err.message || 'Error while getting tasks' };
  }
}

//#endregion

//#region Task Maintenance

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function create(ctx) {
  try {
    const req = ctx.request.body;
    const task = await transaction(Post, Task, async(Post, Task) => {
      const post = await Post.query()
        .insert({
          id: uuid(),
          parent_id: req.parent_id,
          class: 'TASK',
          category_id: req.category_id,
          group_id: req.group_id,
          title: req.title,
          content: req.content,
          created_by: ctx.state.user.id
        });

      const task = await Task.query()
        .insert({
          id: post.id
        });
      return Task.query()
          .join('posts', 'posts.id', 'tasks.id')
          .leftJoin('categories', 'categories.id', 'posts.category_id')
          .where('posts.id', post.id)
          .andWhere('posts.is_deleted', false)
          .andWhere('posts.class', 'TASK')
          .select('posts.id', 'categories.id as category_id', 'categories.code as category_code', 'posts.group_id', 
                  'posts.title', 'tasks.remark', 'tasks.state', 'tasks.progress', 'tasks.completed', 'tasks.start_time', 
                  'tasks.end_time', 'tasks.urgency', 'posts.created_at', 'posts.created_by', 'posts.updated_at', 
                  'posts.updated_by')
          .first();
    });

    if(task) {
      if(task.group_id) {
        delete task.category_id;
        delete task.category_code;
      } else {
        delete task.group_id;
      }
      ctx.status = 201
      ctx.body = {
        status: 'SUCCESS', 
        data: task
      }
    }
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' ,message: err.message || 'Error while getting tasks' };
  }
}

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function detail(ctx) {
  try {
    const task = await Task.query()
                .join('posts', 'posts.id', 'tasks.id')
                .leftJoin('categories', 'categories.id', 'posts.category_id')
                .where('posts.id', ctx.params.id)
                .andWhere('posts.is_deleted', false)
                .andWhere('posts.class', 'TASK')
                .select('posts.id', 'categories.id as category_id', 'categories.code as category_code', 'posts.title', 
                        'tasks.remark', 'tasks.state', 'tasks.progress', 'tasks.completed', 'tasks.start_time', 
                        'tasks.end_time', 'tasks.urgency', 'posts.created_at', 'posts.created_by', 'posts.updated_at', 
                        'posts.updated_by')
                .first();
    if(task) {
      // 1. check the task creator by post id
      if(task.created_by == ctx.state.user.id) {
        ctx.status = 200;
        ctx.body = { status: 'SUCCESS', data: task };
      } else {
        ctx.status = 404;
        ctx.body = { status: 'ERROR' , message: 'Not found' };
      }
    } else {
      ctx.status = 404;
      ctx.body = { status: 'ERROR' , message: 'Not found' };
    }
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' ,message: err.message || 'Error while getting tasks' };
  }
}

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function complete(ctx) {
  try {
    const req = ctx.request.body;
    const post = await Post.query()
        .where('id', req.id)
        .andWhere('is_deleted', false)
        .first();
    if(post) {
      const task = await transaction(Post, Task, async(Post, Task) => {
        await Post.query().update({
          updated_by: ctx.state.user.id
        }).where('id', req.id)
        .andWhere('is_deleted', false);

        await Task.query().update({
          remark: req.remark,
          state: 'COMPLETED',
          progress: 100,
          completed: true 
        }).where('id', req.id);

        return Task.query()
                .join('posts', 'posts.id', 'tasks.id')
                .leftJoin('categories', 'categories.id', 'posts.category_id')
                .where('posts.id', req.id)
                .andWhere('posts.is_deleted', false)
                .andWhere('posts.class', 'TASK')
                .select('posts.id', 'categories.id as category_id', 'categories.code as category_code', 
                        'posts.title', 'tasks.remark', 'tasks.state', 'tasks.progress', 'tasks.completed', 'tasks.start_time', 
                        'tasks.end_time', 'tasks.urgency', 'posts.created_at', 'posts.created_by', 'posts.updated_at', 
                        'posts.updated_by')
                .first();
      });

      if(task) {
        ctx.status = 200;
        ctx.body = { status: 'SUCCESS', data: task };
      } 
    } else {
      ctx.status = 404;
      ctx.body = { status: 'ERROR' , message: 'Not found' };
    }
  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' ,message: err.message || 'Error while getting tasks' };
  }
}

/**
 * @since 1.1.0
 * @param {Object} ctx 
 */
async function assign(ctx) {
  const req = ctx.request.body;
  if(req.assign_type === 'CATEGORY') {
    this.assignToCategory(ctx);
  } else if(req.assign_type === 'GROUPMEMBER') {
    this.assignToGroupMember(ctx);
  }
}

/**
 * Assign task to category
 * 
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

      return Task.query()
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
 * Assing task to a group member
 * 
 * @since 1.1.0 
 * @param {Object} ctx 
 */
async function assignToGroupMember(ctx) {
  try {

  } catch(err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = { status: 'ERROR' , message: err.message || 'Error while getting tasks' };
  }
}

//#endregion

//#region Private Methods
//#endregion

/**
 * @since 1.1.0
 */
module.exports = {
  createCategory, listCategory,
  create, detail, complete, assign
};
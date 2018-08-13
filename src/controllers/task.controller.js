'use strict'

const Router = require('koa-router')
const uuid = require('uuid/v1')

const postRepository = require('../repositories/post.repository')
const taskRepository = require('../repositories/task.repository')
const taskValidator = require('../middlewares/validators/task.validator')

const routes = new Router()

routes.post('/', taskValidator.validateForm, async(ctx) => {
  const request = ctx.request.body
  const postData = {
    id: uuid(),
    parent_id: request.parent_id,
    title: request.title,
    content: request.content,
    created_by: ctx.state.user.id
  }

  const taskData = {
    id: postData.id,
    created_by: ctx.state.user.id
  }

  await postRepository.create(postData).then(async(post) => {
    if(!post) { } 
    await taskRepository.create(taskData).then(async(task) => {
      if(!task) { }
      ctx.status = 201
      ctx.body = {
        status: 'SUCCESS', 
        data: {
          id: task.id,
          title: post.title,
          state: task.state,
          completed: task.completed,
          urgency: task.urgency
        }
      }
      return ctx
    }).catch((err) => {
      ctx.status = 400 
      ctx.body = { message: err.message || 'Error while getting tasks' }
      return ctx
    })
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
})

module.exports = routes
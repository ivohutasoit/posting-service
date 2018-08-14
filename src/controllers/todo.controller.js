'use strict'

const Router = require('koa-router')

const authMiddlerware = require('../middlewares/auth.middleware')
const taskRepository = require('../repositories/task.repository')

const routes = new Router()

routes.get('/', async(ctx) => {
  await taskRepository.findByUserId(ctx.state.user.id).then((tasks) => {
    ctx.status = 200
    ctx.body = {
      status: 'SUCCESS',
      data: tasks
    }
    return ctx
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
})

module.exports = routes
'use strict'

const Router = require('koa-router')

const authMiddlerware = require('../middlewares/auth.middleware')
const todoRepository = require('../repositories/todo.repository')

const routes = new Router()

routes.get('/', async(ctx) => {
  await todoRepository.findByUserId(ctx.state.user.id).then((tasks) => {
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
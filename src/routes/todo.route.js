'use strict'

const Router = require('koa-router')

const taskController = require('../controllers/task.controller')
const todoController = require('../controllers/todo.controller')

const routes = new Router()

routes.use(todoController.routes(), todoController.allowedMethods())
routes.use('/task', taskController.routes(), taskController.allowedMethods())

module.exports = routes
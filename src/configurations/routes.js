'use strict'

const Router = require('koa-router')

const application = require('./application')
const authMiddlerware = require('../middlewares/auth.middleware')

const routes = new Router()

routes.get('/', async(ctx) => {
  ctx.render('index', { title : application.name }, true)
})

routes.get('/auth/info', authMiddlerware.isAuthenticated, async(ctx) => {
  ctx.status = 200
  ctx.body = {
    status: 'SUCCESS',
    data: ctx.state.user
  }
  return ctx
})

module.exports = routes
'use strict'

const Router = require('koa-router')

const application = require('./application')

const routes = new Router()

routes.get('/', async(ctx) => {
  ctx.render('index', { title : application.name }, true)
})

module.exports = routes
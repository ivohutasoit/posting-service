'use strict'

const Router = require('koa-router')
const uuid = require('uuid/v1')

const categoryRepository = require('../repositories/category.repository')
const categoryValidator = require('../middlewares/validators/category.validator')

const routes = new Router()

routes.get('/', categoryValidator.validateList, async(ctx) => {
  await categoryRepository.findByUserId(ctx.state.user.id).then((categories) => {
    ctx.status = 200
    ctx.body = {
      status: 'SUCCESS',
      data: categories
    }
    return ctx
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
})

routes.post('/', categoryValidator.validateForm, async(ctx) => {
  var categoryData = ctx.request.get
  categoryData.created_by = ctx.state.user.id
  await categoryRepository.create(categoryData).then((category) => {
    if(!category) { }

    ctx.status = 201
    ctx.body = {
      status: 'SUCCESS', 
      data: {
        id: category.id,
        code: category.code,
        name: category.name
      }
    }
    return ctx
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
})


module.exports = routes
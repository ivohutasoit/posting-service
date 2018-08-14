'use strict'

const categoryRepository = require('../../repositories/category.repository')
const taskRepository = require('../../repositories/task.repository')

async function validateForm(ctx, next) {
  const request = ctx.request.body
  var valid = true
  var messages = {}
  if(!request.title) {
    if(valid) valid = false
    messages.title = 'required'
  }

  if(request.category_id) {
    await categoryRepository.findById(request.category_id).then((category) => {
      if(!category) {
        if(valid) valid = false
        messages.category_id = 'Not found'
      }
    })
  }

  if(!valid) {
    ctx.status = 400
    ctx.body = {
      status: 'ERROR',
      messages: messages
    }
    return ctx
  }

  return next()
}

async function validateAction(ctx, next) {
  if(!ctx.params.action) {
    ctx.status = 400
    ctx.body = {
      status: 'ERROR',
      messages: 'Invalid action. Use inprogress, stop, completed, assign, or unassign instead'
    }
    return ctx
  } else {
    const action = ctx.params.action.toUpperCase()
    if(action !== 'INPROGRESS' && action !== 'STOP' && action !== 'COMPLETED' 
      && action !== 'ASSIGN' && action !== 'UNASSIGN') {
      ctx.status = 400
      ctx.body = {
        status: 'ERROR',
        messages: 'Invalid action. Use inprogress, stop, completed, assign, or unassign instead'
      }
      return ctx
    }
  }
  if(ctx.params.action.toUpperCase() === 'COMPLETED') {
    if(!ctx.request.body.id) {
      ctx.status = 400
      ctx.body = {
        status: 'ERROR',
        messages: { id : 'required' }
      }
      return ctx
    }
  }

  return next()
}

async function hasAccess(ctx, next) {
  const id = ctx.params.id
  const userId = ctx.state.user.id
  // Task Creator
  await taskRepository.findByUserId(userId).then((task) => {
    if(!task) {
      ctx.status = 401
      ctx.body = {
        status: 'ERROR',
        message: 'Unauthorized'
      }
      return ctx
    }

    if(task.id !== id) {
      ctx.status = 401
      ctx.body = {
        status: 'ERROR',
        message: 'Unauthorized'
      }
      return ctx
    }
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
  return next()
}

module.exports = {
  validateForm, validateAction, hasAccess
}
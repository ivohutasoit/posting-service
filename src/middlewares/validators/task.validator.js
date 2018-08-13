'use strict'

async function validateForm(ctx, next) {
  const request = ctx.request.body
  var valid = true
  var messages = {}
  if(!request.title) {
    if(valid) valid = false
    messages.title = 'required'
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

module.exports = {
  validateForm, validateAction
}
'use strict'

async function validateForm(ctx, next) {
  const request = ctx.request.body
  var valid = true
  var messages = { }

  if(!request.type) {
    if(valid) valid = false
    messages.type = 'required'
  } else {
    request = request.toUpperCase()
    if(request !== 'TASK') {
      if(valid) valid = false
      messages.type = 'Invalid type. Use task instead'
    }
  }

  if(!request.code) {
    if(valid) valid = false
    messages.code = 'required'
  }

  if(!request.description) {
    if(valid) valid = false
    messages.description = 'required'
  }

  if(!valid) {
    ctx.status = 400
    ctx.body = {
      status: 'ERROR',
      message: messages
    }
    return ctx
  }

  return next()
}

async function validateList(ctx, next) {
  const type = ctx.params.type
  var valid = true
  var messages = { }
  if(!type) {
    if(valid) valid = false
    messages.type = 'required'
  } else {
    if(type.toUpperCase() !== 'TASK') {
      if(valid) valid = false
      messages.type = 'Invalid type. Use task instead'
    }
  }
  if(!valid) {
    ctx.status = 400
    ctx.body = {
      status: 'ERROR',
      message: messages
    }
    return ctx
  }
  return next()
}

module.exports = {
  validateList,
  validateForm
}
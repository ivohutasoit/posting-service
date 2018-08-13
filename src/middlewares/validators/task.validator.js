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

module.exports = {
  validateForm
}
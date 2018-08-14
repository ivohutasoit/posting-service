'use strict'

async function validateForm(ctx, next) {
  const request = ctx.request.body
  var valid = true
  var messages = { }

  if(!request.code) {
    if(valid) valid = false
    messages.code = 'required'
  }

  /* if(!request.description) {
    if(valid) valid = false
    messages.description = 'required'
  } */

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
  validateForm
}
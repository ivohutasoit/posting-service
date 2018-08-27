'use strict'

const { Category } = require('../models');

async function validateCreate(ctx, next) {
  const req = ctx.request.body
  var valid = true
  var messages = { }

  if(!req.code) {
    if(valid) valid = false;
    messages.code = 'required';
  } else {
    const category = await Category.query()
      .where('code', req.code.toUpperCase())
      .andWhere('is_deleted', false)
      .andWhere('created_by', ctx.state.user.id) 
      .first()
      
    if(category) {
      if(valid) valid = false;
      messages.code = 'Already exists';
    }
  }

  /* if(!req.description) {
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
  validateCreate
}
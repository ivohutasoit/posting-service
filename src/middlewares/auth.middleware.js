'use strict'

const request = require('request-promise')

async function isAuthenticated(ctx, next) {
  if (!(ctx.headers && ctx.headers.authorization)) {
    ctx.status = 401
    ctx.body = {
      status: 'ERROR',
      message: 'Unauthorized'
    }
    return ctx
  }

  const options = {
    method: 'GET',
    uri: process.env.AUTH_SERVICE_URI || 'http://localhost:3000/api/v1/auth/info',
    json: true,
    headers: {
      authorization: `Bearer ${ctx.headers.authorization.split(' ')[1]}`,
    }
  }
  return request(options).then((response) => {
      ctx.state.user = response.data.user
      return next()
    }).catch((err) => { 
      console.log(err) 
      return next(err)
    })
}

module.exports = { 
  isAuthenticated
}
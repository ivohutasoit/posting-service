'use strict'

const request = require('request-promise');

/**
 * @since 1.1.0
 * @param {Object} ctx 
 * @param {method} next callback method
 */
function authenticatedUser(ctx, next) {
  if (!(ctx.headers && ctx.headers.authorization)) {
    ctx.status = 401
    ctx.body = {
      status: 'ERROR',
      message: 'Unauthorized'
    }
  } else {
    const uri = process.env.API_THIRDPARTY_URI || 'http://localhost:3000/api/v1';
    const options = {
      method: 'GET',
      uri: uri + '/auth/info',
      json: true,
      headers: {
        authorization: `Bearer ${ctx.headers.authorization.split(' ')[1]}`,
      }
    };
    return request(options).then((response) => {
        ctx.state.user = response.data.user;
        return next();
      }).catch((err) => { 
        console.log(err);
        return next(err);
      });
  }
}

/**
 * @since 1.1.0
 */
module.exports = {
  authenticatedUser
};
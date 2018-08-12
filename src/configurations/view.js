'use strict'

const Pug = require('koa-pug')

const view = new Pug({
  viewPath: './src/views',
  basedir: './src/views'
})

module.exports = view
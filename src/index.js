'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const errorHandler = require("koa-error")
const logger = require("koa-logger")
const session = require('koa-session')

const application = require('./configurations/application')
const authentication =  require('./configurations/authentication')
const routes = require('./configurations/routes')
const view = require('./configurations/view')

const app = new Koa()

// session
if (!application.keys) { throw new Error("Please add session secret key in the config file!"); }
  app.keys = application.keys
// app.use(session({ store: new RedisStore() },app))
app.use(session(app))

// Authentication
app.use(authentication.initialize())
app.use(authentication.session())

// Body parser
app.use(bodyParser())

// Logger
app.use(logger())

// Error handler
app.use(errorHandler())

// View
view.use(app)

// Routes
app.use(routes.routes())
app.use(routes.allowedMethods())

module.exports = app.listen(application.port, () => {
  console.log(`Server's listen on port ${application.port}`)
})
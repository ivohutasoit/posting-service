'use strict'

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const errorHandler = require("koa-error");
const logger = require("koa-logger");
const session = require('koa-session');

const { Application, View } = require('./configurations');
const { Route } = require('./middlewares');

const app = new Koa()

// session
if (!Application.keys) { throw new Error("Please add session secret key in the config file!"); }
  app.keys = Application.keys;
// app.use(session({ store: new RedisStore() },app))
app.use(session(app));

// Authentication
//app.use(authentication.initialize())
//app.use(authentication.session())

// Body parser
app.use(bodyParser())

// Logger
app.use(logger())

// Error handler
app.use(errorHandler())

// View
View.use(app)

// Routes
app.use(Route.routes())
app.use(Route.allowedMethods())

/**
 * @since 1.0.0
 */
module.exports = app.listen(Application.port, () => {
  console.log(`Server's listen on port ${Application.port}`)
});
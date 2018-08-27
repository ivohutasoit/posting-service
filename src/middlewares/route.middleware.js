'use strict'

const Router = require('koa-router');

const { Application } = require('../configurations');
const { ApiV1 } = require('../routes');

const routes = new Router();
routes.get('/', async(ctx) => {
  ctx.render('index', { title : Application.name }, true);
});

routes.use(ApiV1.routes(), ApiV1.allowedMethods());

/**
 * @since 1.1.0
 */
module.exports = routes;
'use strict'

const Router = require('koa-router');

const ThirdParty = require('../middlewares/thirdparty.middleware');
const Controller = require('../controllers');
const Validator = require('../validators');

const v1 = new Router({ prefix: '/api/v1'});

// User Todo List & Task
v1.get('/todo', ThirdParty.authenticatedUser, Controller.Todo.list);
v1.post('/todo/task', ThirdParty.authenticatedUser,
    Validator.task.validateCreate, Controller.Task.create);
v1.post('/todo/task/category', ThirdParty.authenticatedUser, 
    Validator.taskCategory.validateCreate, Controller.Task.createCategory);
v1.get('/todo/task/category', ThirdParty.authenticatedUser, 
    Controller.Task.listCategory);
v1.post('/todo/task/complete', ThirdParty.authenticatedUser,
    Validator.task.validateComplete, Controller.Task.complete);
v1.post('/todo/task/assign', ThirdParty.authenticatedUser,
    Validator.task.validateAssignment, Controller.Task.assign);
v1.get('/todo/task/:id', ThirdParty.authenticatedUser, 
    Controller.Task.detail);

// User comments

module.exports = v1;
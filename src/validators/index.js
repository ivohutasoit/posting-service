'use strict'

const category = require('./category.validator'); 
const task = require('./task.validator');
const taskCategory = require('./task.category.validator');
/**
 * @since 1.1.0
 */
module.exports = {
  task,
  taskCategory
}
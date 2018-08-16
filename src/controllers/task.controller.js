'use strict'

const Router = require('koa-router')
const uuid = require('uuid/v1')

const assignmentRepository = require('../repositories/assignment.repository')
const categoryRepository = require('../repositories/category.repository')
const postRepository = require('../repositories/post.repository')
const taskRepository = require('../repositories/task.repository')
const categoryValidator = require('../middlewares/validators/task.category.validator')
const taskValidator = require('../middlewares/validators/task.validator')

const routes = new Router()

//#region Task Category

routes.get('/category', async(ctx) => {
  await categoryRepository.findTaskClassByUserId(ctx.state.user.id).then((categories) => {
    ctx.status = 200
    ctx.body = {
      status: 'SUCCESS',
      data: categories
    }
    return ctx
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
})

routes.post('/category', categoryValidator.validateForm, async(ctx) => {
  var categoryData = {
    id: uuid(),
    class: 'TASK',
    code: ctx.request.body.code.toUpperCase(),
    description: ctx.request.get.description,
    created_by: ctx.state.user.id
  }
  await categoryRepository.create(categoryData).then((category) => {
    if(!category) { }

    ctx.status = 201
    ctx.body = {
      status: 'SUCCESS', 
      data: {
        id: category.id,
        class: category.class,
        code: category.code,
        name: category.name,
        description: description
      }
    }
    return ctx
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
})

//#endregion

//#region Task Maintenance

routes.post('/', taskValidator.validateForm, async(ctx) => {
  const request = ctx.request.body
  const postData = {
    id: uuid(),
    parent_id: request.parent_id,
    class: 'TASK',
    category_id: request.category_id,
    title: request.title,
    content: request.content,
    created_by: ctx.state.user.id
  }
  const taskData = { id: postData.id }

  await postRepository.create(postData).then(async(post) => {
    if(!post) { } 
    await taskRepository.create(taskData).then(async(task) => {
      if(!task) { }

      await assignmentRepository.create({ 
        id: uuid(), 
        task_id: task.id, 
        user_id: ctx.state.user.id,
        created_by: ctx.state.user.id 
      }).catch((err) => {
        console.log(err)
      })

      ctx.status = 201
      ctx.body = {
        status: 'SUCCESS', 
        data: {
          id: task.id,
          category_id: !post.category_id ? 'DEFAULT' : post.category_id,
          title: post.title,
          state: task.state,
          completed: task.completed,
          urgency: task.urgency
        }
      }
      return ctx
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
})

routes.post('/:action', taskValidator.validateAction, async(ctx) => {
  const action = ctx.params.action.toUpperCase()
  if(action == 'COMPLETED')
    await completeTask(ctx) 
})

routes.get('/:id', async(ctx) => {
  await taskRepository.findByIdAndCreatorId(ctx.params.id, ctx.state.user.id).then((task) => {
    if(!task) {
      ctx.status = 404
      ctx.body = {
        status: 'ERROR',
        message: 'Not found'
      }
      return ctx
    }

    ctx.status = 200
    ctx.body = {
      status: 'SUCCESS',
      data: task
    }
    return ctx
  })
})

//#endregion

//#region Private Methods
/**
 * 
 * @param {Object} ctx 
 */
async function completeTask(ctx) {
  const request = ctx.request.body
  const action = ctx.params.action.toUpperCase()
  await taskRepository.update({ id: request.id, state: action, completed: true }).then(async(task) => {
    if(!task) {
      ctx.state = 404
      ctx.body = {
        status: 'ERROR',
        message: 'Not found'
      }
      return ctx
    }
    await postRepository.update({ id: task.id, updated_by: ctx.state.user.id }).then((post) => {
      if(!post) {
        ctx.state = 404
        ctx.body = {
          status: 'ERROR',
          message: 'Not found'
        }
        return ctx
      }
      ctx.status = 201
      ctx.body = {
        status: 'SUCCESS', 
        data: {
          id: task.id,
          title: post.title,
          state: task.state,
          completed: task.completed
        }
      }
      return ctx
    }).catch((err) => {
      ctx.status = 400 
      ctx.body = { message: err.message || 'Error while getting tasks' }
      return ctx
    })
  }).catch((err) => {
    ctx.status = 400 
    ctx.body = { message: err.message || 'Error while getting tasks' }
    return ctx
  })
}
//#endregion

module.exports = routes
'use strict'

const bcrypt = require('bcrypt')
const passport = require('koa-passport')
const passportLocal = require('passport-local')
const passportJWT = require('passport-jwt')

const application = require('./application')
// const userRepository = require('../repositories/user.repository')

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const options = {}

function comparePassword(userPassword, storedPassword) {
  return bcrypt.compareSync(userPassword, storedPassword)
}

passport.serializeUser((user, done) => { done(null, user.id) })

passport.deserializeUser((id, done) => {
  return done(null, { id: '1', username: 'username' })

  /* return userRepository.getById(id).then((user) => {
    done(null, { id: user.id, username: user.username, hv_admin: user.hv_admin, is_active: user.is_active })
  }).catch((err) => { done(err, null) }) */
})

passport.use(new LocalStrategy(options, (username, password, done) => {
  return done(null, { id: '1', username: 'username' })

  /* userRepository.getByUsername(username).then((user) => {
    if(!user) return done(null, false)
    if(!comparePassword(password, user.password))
      return done(null, false)
  
    return done(null, { id: user.id, username: user.username, hv_admin: user.hv_admin, is_active: user.is_active })
  }).catch((err) => { return done(err) }) */
}))

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: application.secret
}, (payload, done) => {
  return done(null, { id: '1', username: 'username' })

  /* userRepository.getById(payload.id).then((user) => {
    if(!user) return done(null, false)
    return done(null, { id: user.id, username: user.username, hv_admin: user.hv_admin, is_active: user.is_active }) 
  }) */
}))

module.exports = passport
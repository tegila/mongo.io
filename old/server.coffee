## Express.JS ##
express = require 'express'
app = do express

## Express.JS related ##
morgan = require("morgan")
methodOverride = require("method-override")
session = require("express-session")
MongoStore   = require('connect-mongo')(session)

bodyParser = require("body-parser")
multer = require("multer")
errorHandler = require("errorhandler")
cookieParser = require('cookie-parser')

## passport ##
passport = require('passport')
util = require 'util'

## Local includes ##
config = require "./config"
Routes = require "./Routes"
MongoPool = require "./MongoPool.coffee"
ObjectID = require('mongodb').ObjectID 

# express http verb setup

app.use do cookieParser # read cookies (needed for auth)
app.use do methodOverride
## express addons
app.use do bodyParser.json
app.use bodyParser.urlencoded(extended: true)
app.use do multer

## Debugger
app.use morgan("dev")
app.use errorHandler
  dumpExceptions: true
  showStack: true

# required for passport
app.use session 
  saveUninitialized: false # don't create session until something stored
  resave: false #don't save session if unmodified
  store: new MongoStore
    url: 'mongodb://192.168.1.112:27017/temp'
  secret: config.express.secret # session secret
  cookie: 
    domain: ".tegila.com.br"
    maxAge: 3600000

## Passport <<START>>
app.use do passport.initialize
app.use do passport.session
  
passport.serializeUser (user, done) ->
  done(null, user.id)

passport.deserializeUser (id, done) ->
  console.log "server.deserializeUser:57 ID: #{id}"
  MongoPool("app").getConnection (db) ->
    col = db.collection "users"
    col.find({"_id": new ObjectID(id)}).limit(1).toArray (err, user) ->
      console.log "server.deserializeUser:56 User: #{user}"
      done(err, user)

###
 * [loggedIn is a function that check for user existence inside the database]
 * @param  {[express.js req]}
 * @param  {[express.js res]}
 * @param  {Function callback}
 * @return {Boolean}
###
isLoggedIn = (req, res, next) ->
  console.log "routes.coffee:3 req.cookies = #{util.inspect(req.cookies, false, null)}" 
  console.log "routes.isLoggedIn:L57 req.user: #{req.user}"
  console.log "routes.isLoggedIn:L57 req.params: #{req.params}"
  if req.isAuthenticated()
    return next()

  res.sendStatus(401) #unauthotized 
app.use isLoggedIn
## Passport <<END>>


###
 * [Parse Date: express bodyparse don't parse Date string, so we did! ]
 * @param  {[express req]}
 * @param  {[express res]}
 * @param  {Function callback}
 * @return {[Boolean]}
###
parseDate = (req, res, next) ->
  deepIterate = (obj) ->
    for k, v of obj
      console.log k, v
      if v isnt null and typeof v is 'object'
        deepIterate(v)
      else if typeof v is 'string'
        if v.match /^(\d){4}-(\d){2}-(\d){2}T(\d){2}:(\d){2}:(\d){2}.(\d){3}Z$/i
          obj[k] = new Date Date.parse(v)
  deepIterate req.body
  do next
app.use parseDate

## -+> Start
Routes app, passport

on_listen = ->
  hostout = if config.express.host then config.express.host else '*'
  console.log "Started at http://#{hostout}:#{config.express.port} [#{config.express.env}]"

if config.express.host
  app.listen config.express.port, config.express.host, on_listen
else
  app.listen config.express.port, on_listen

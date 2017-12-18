const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {SECRET} = require('./config/constants.json')
const {info, warn, error} = require('./logger/log4js')
const session = require('express-session')
const favicon = require('express-favicon')
const api = require('./api')
const path = require('path')
const {OTASecretsDao} = require('./dao/otaSecrets')
const cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
  secret: 'OTAServer',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
// allow CORS 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})
app.use((req, res, next) => {
  let keyNum = req.body.number || req.query.number || req.headers['number'] || 1
  OTASecretsDao.getCurrentSecret({isCurrent: true, keyNum: keyNum}, (err, result) => {
    info.info(result[0].secret)
    if (!err) {  
      app.locals.secret = result[0].secret
    }
    next()
  })
})
app.use(favicon(path.join(__dirname,'favicon.ico')))
app.use('/',express.static(__dirname))
app.use('/static', express.static(path.join(__dirname, 'static')))
app.set('SECRET', SECRET)
global.sessionMap = []
app.locals.sessionMap = []
// import api that we use
app.use("/api", api)
// set up refresh default route
app.use('/*', (req, res) => {
  res.redirect('/')
})
app.locals.session = {}
module.exports = app
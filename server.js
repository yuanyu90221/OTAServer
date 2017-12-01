const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const port = process.env.PORT || 7000
const host = process.env.HOST || '127.0.0.1'
const bodyParser = require('body-parser')
const {SECRET} = require('./config/constants.json')
const {info, warn, error} = require('./logger/log4js')
const session = require('express-session')
const favicon = require('express-favicon')
const api = require('./api')
const path = require('path')
app.use(bodyParser.json())
app.use(session({
  secret: 'OTAServer',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(favicon(path.join(__dirname,'favicon.ico')))
app.use(express.static(path.join(__dirname,'/')))
app.use('/static', express.static('static'))
app.set('port', port)
app.set('SECRET', SECRET)
// import api that we use
app.use("/api", api)
app.listen(port, host, ()=>{
  info.info(`OTA Server start on ${host}:${port}`)
})
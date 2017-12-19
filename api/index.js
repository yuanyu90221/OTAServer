const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const OTAUsersDao = require('../dao/otaUsers').OTAUsersDao
const otaSecrets = require('./otaSecrets')
const axios = require('axios')
const {OTASecretsDao} = require('../dao/otaSecrets')
const otaRoute = require('./otaRoute')
let {authChecker, tokenVerifierNext} = require('./authChecker')
router.post('/sessionsStatus', (req, res, next) => {
  const {username} = req.body
  // console.log(username)
  if (global.sessionMap) {
    const result = global.sessionMap.find((session, index)=> {
      // console.log(session)
      return session.username && session.username === username
    })
    info.info(result)
    res.json({'session': result})
  }
  else {
    res.json({'session': null})
  }
})
router.get('/users', (req, res, next) =>{
  OTAUsersDao.findUser({}, (err, otaUsers) => {
    res.json({data: otaUsers})  
  }).catch((err) => {
    res.json({err: err.message})
  })
})
router.post('/user', authChecker, tokenVerifierNext, (req, res) => {
  info.info(`res.locals.authUser`)
  info.info(res.locals.authUser)
  let data = res.locals.authUser
  req.session.authUser = {username: data.username, role: data.role, token: data.token}
  info.info(req.session)
  info.info(`sessionMap`)
  global.sessionMap = global.sessionMap || []
  global.sessionMap.push(req.session.authUser)
  info.info(global.sessionMap)
  res.json({token: data.token, username: data.username, role: data.role})
})

router.post('/logout', (req, res) => {
  delete req.session.authUser
  res.redirect('/')
})
router.use(otaRoute)
router.use(otaSecrets)

module.exports = router
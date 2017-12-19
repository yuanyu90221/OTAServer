const {Router} = require('express')
const router = Router()
const {info, warn, error} = require('../logger/log4js')
const {OTAUsersDao} = require('../dao/otaUsers')
const otaRoute = require('./otaRoute')
const otaSecrets = require('./otaSecrets')
let {authChecker, tokenVerifierNext} = require('./authChecker')

router.post('/sessionsStatus', (req, res, next) => {
  const {username} = req.body
  if (global.sessionMap) {
    const result = global.sessionMap.find((session, index)=> {
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
  let {authUser} = req.session
  if (authUser) {
    let {username} = authUser
    username = username || ''
    if (username === '') {
      global.sessionMap = global.sessionMap.filter((session, index)=> {
        return session.username !== username
      })
      console.log(global.sessionMap)
    }
  }
  delete req.session.authUser
  res.redirect('/')
})
router.use(otaRoute)
router.use(otaSecrets)

module.exports = router
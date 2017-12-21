const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const {OTASecretsDao} = require('../dao/otaSecrets')
const {OTAUsersDao} = require('../dao/otaUsers')
const {SECRET} = require('../config/constants.json')
const CodeManager = require('../util/codeManager')
let {authChecker, tokenVerifier} = require('./authChecker')

/**
 * get authentication token
 */
router.post('/authenticate', authChecker, tokenVerifier)
/**
 * jwt token
 */
router.use(function( req, res, next){
  // ADD jwt token
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  let keyNum = req.body.number || req.query.number || req.headers['number'] || 1
  console.log(keyNum, token)
  info.info(token, keyNum)
  if (token && !Number.isNaN(keyNum)) {
    OTASecretsDao.getCurrentSecret({isCurrent: true, keyNum}, (err, result) => {
      return result[0].secret
    }).then((data) => {
      info.info(data[0].secret)
      if (data && data[0]) {   
        let secret = (data[0].secret) ? data[0].secret:SECRET
        res.locals.secret = secret
        res.locals.token = token
        next()
      }
      else {
        res.statu(403).json({err: 'fail to authentication, key not match'})
      }
    })
  } else {
    res.status(403).json({err: 'token not provideds'})
  }
})
/**
 * jwt decode
 */
router.use(function(req, res, next) {
  let {secret, token} = res.locals
  console.log(secret)
  info.info(secret, token)
  secret = secret || SECRET
  console.log(secret)
  console.log(token.toString('base64'))
  jwt.verify(token.toString('base64'), secret, function(err, decoded) {
    if (err) {
      console.log(err.message)
      res.json({err: 'fail to authentication'})
    } else {
      res.decoded = decoded
      info.info(`decoded`, decoded)
      next()
    }
  })
})
/**
 * get Secrets method
 */
router.get('/getAllSecrets', (req, res, next) => {
  OTASecretsDao.getAllSecrets((err, allSecrets) => {
    res.json({data: allSecrets})
  })
})
/**
 * 取得目前的 SECRET
 */
router.get('/currentSecret', (req, res) => {
  let {keyNum} = req.body
  keyNum = keyNum || 1
  OTASecretsDao.getCurrentSecret({isCurrent: true, keyNum: keyNum}, (err, result) => {
    info.info(result[0].secret)
    res.json({secret: result[0].secret})
  })
})
/**
 * modify secret flow
 */
router.post('/modifySecret', (req, res, next) => {
  let {userId, secret, keyNum} = req.body
  OTASecretsDao.upsertSecret(userId, secret, keyNum, true, (err, result) => {
    if (err) { res.json({err: err.message}) }
    else {
      global.secret = secret
      let { modifiedDate } = result
      keyNum = keyNum || 1
      OTASecretsDao.getCurrentSecret({isCurrent: true, keyNum: keyNum})
      .then((data) => {
        if (data && data[0]) {
          info.info(`secret:`)
          info.info(data[0].secret) 
          let KeySign = data[0].secret
          OTAUsersDao.findUser({userId:userId}, (err, result)=> {
            return result[0]
          }).then((data) => {
            info.info(`userData:`)
            info.info(data[0])
            let {username, role} = data[0]
            let user = {username: username, role: role}
            let token = jwt.sign(user, KeySign, {
              expiresIn: 60 * 60 * 24
            })
            // update the token to the resign one
            global.sessionMap.forEach((session, index) => {
              if (session.username === username) {
                session.token = token
              }
            })

            res.json({data: [{userId: userId, secret: KeySign, modifiedDate: modifiedDate, token: token.toString('base64')}]})
          })
        } else {
          res.status(403).json({err: `secret with keyNum: ${keyNum} is not found`})
        }        
      })
    }
  })
})
module.exports = router
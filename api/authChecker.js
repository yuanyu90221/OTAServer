const jwt = require('jsonwebtoken')
const {SECRET} = require('../config/constants.json')
const {info, warn, error} = require('../logger/log4js')
const {OTASecretsDao} = require('../dao/otaSecrets')
const {OTAUsersDao} = require('../dao/otaUsers')
const CodeManager = require('../util/codeManager')
// auth check middleware
const authChecker = (req, res, next) => {
  let {username} = req.body 
  username = username || ''
  OTAUsersDao.findUser({
    username: username
  }, (err, result) => {
    if(err) {
      error.error(err.message)
      throw new Error(err.message)
    }
  }).then(result => {
    res.locals.result = result
    if (!result || !result[0] || result[0].passwd.content !== CodeManager.encryptIV(req.body.passwd).content) {
      res.json({err: 'Authentication Error'})
    }
    else
     next()
  }).catch(err=> {
    res.json({err: err.message})
  })
}
// token handler
const tokenVerifier = (req, res, next) => {
  let {number, keyNum} = req.body
  let {result} = res.locals
  keyNum = number || keyNum || 1
  console.log(keyNum)
  OTASecretsDao.getCurrentSecret({isCurrent: true, keyNum: keyNum}, (err, result) => {
    return result[0].secret
  })
  .then((data) => {
    console.log(data)
    if (data && data[0] && result) {
      info.info(`secret `,data[0].secret)
      let secret = (data[0].secret) ? data[0].secret:SECRET
      info.info(secret)
      console.log(secret)
      let user = {username: result[0].username, role: result[0].role}
      let token = jwt.sign(user, secret, {
        expiresIn: 60 * 60 * 24
      })
      res.json({
        msg: 'token delivered',
        token: token,
        username: result[0].username,
        role: result[0].role
      })
    } else {
      res.status(403).json({err: `sign key not found`})
    }
  }).catch(err => {
    res.status(400).json({err: err.message})
  })
}
// token generator middleware
const tokenVerifierNext = (req, res, next) => {
  let {number, keyNum} = req.body
  let {result} = res.locals
  keyNum = number || keyNum || 1
  console.log(keyNum)
  OTASecretsDao.getCurrentSecret({isCurrent: true, keyNum: keyNum}, (err, result) => {
    return result[0].secret
  })
  .then((data) => {
    console.log(data)
    if (data && data[0] && result) {
      info.info(`secret `,data[0].secret)
      let secret = (data[0].secret) ? data[0].secret:SECRET
      info.info(secret)
      console.log(secret)
      console.log(result[0])
      let user = {username: result[0].username, role: result[0].role}
      let token = jwt.sign(user, secret, {
        expiresIn: 60 * 60 * 24
      })
      res.locals.authUser = { username: result[0].username, role: result[0].role, token: token}
      next()
    } else {
      res.status(403).json({err: `sign key not found`})
    }
  }).catch(err => {
    res.status(400).json({err: err.message})
  })
}
module.exports.authChecker = authChecker
module.exports.tokenVerifier = tokenVerifier
module.exports.tokenVerifierNext = tokenVerifierNext

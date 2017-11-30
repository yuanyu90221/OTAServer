const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const {OTASecretsDao} = require('../dao/otaSecrets')
const {OTAUsersDao} = require('../dao/otaUsers')
const {SECRET} = require('../config/constants.json')
const CodeManager = require('../util/codeManager')
router.post('/authenticate', (req, res, next) => {
  OTAUsersDao.findUser({
    username: req.body.username
  }, (err, result) => {
    if (err) {
      res.json({err: err.message})
    } else {
      if (!result) {
        res.json({err: 'Authentication Error'})
      } else if (result.passwd.content == CodeManager.encrypt(req.body.passwd).content) {
        res.json({err: 'Authentication Error'})
      }
    }
  })
})
router.use(function( req, res, next){
  // ADD jwt token
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) {
        res.json({err: 'fail to authentication'})
      } else {
        res.decoded = decoded
        info.info(`decoded`, decoded)
        next()
      }
    })
  } else {
    res.status(403).json({err: 'token not provideds'})
  }
})


router.get('/getAllSecrets', (req, res, next) => {
  OTASecretsDao.getAllSecrets((err, allSecrets) => {
    res.json({data: allSecrets})
  })
})
module.exports = router
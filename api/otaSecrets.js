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
      } else if (result) {
        if ( !result[0] || result[0].passwd.content !== CodeManager.encryptIV(req.body.passwd).content) {
          res.json({err: 'Authentication Error'})
        } else {
          OTASecretsDao.getCurrentSecret({isCurrent: true}, (err, result) => {
            return result[0].secret
          })
          .then((data) => {
            console.log(`secret`,data[0].secret)
            let secret = (data[0].secret) ? data[0].secret:SECRET
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
          })
        }
      } 
    }
  })
})
router.use(function( req, res, next){
  // ADD jwt token
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  console.log(token)
  // let secret = global.secret | SECRET
  if (token) {
    OTASecretsDao.getCurrentSecret({isCurrent: true}, (err, result) => {
      return result[0].secret
    }).then((data) => {
      let secret = (data[0].secret) ? data[0].secret:SECRET
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({err: 'fail to authentication'})
        } else {
          res.decoded = decoded
          info.info(`decoded`, decoded)
          next()
        }
      })
    })
  } else {
    res.status(403).json({err: 'token not provideds'})
  }
})


router.get('/getAllSecrets', (req, res, next) => {
  console.log(req.query)
  OTASecretsDao.getAllSecrets((err, allSecrets) => {
    res.json({data: allSecrets})
  })
})

router.get('/currentSecret', (req, res) => {
  OTASecretsDao.getCurrentSecret({isCurrent: true}, (err, result) => {
    console.log(result[0].secret)
    res.json({secret: result[0].secret})
  })
})
router.post('/modifySecret', (req, res, next) => {
  let {userId, secret, keyNum} = req.body
  OTASecretsDao.upsertSecret(userId, secret, keyNum, true, (err, result) => {
    if (err) { res.json({err: err.message}) }
    else {
      global.secret = secret
      let { modifiedDate } = result
      OTASecretsDao.getCurrentSecret({isCurrent: true}, (err, result) => {
        return result[0].secret
      })
      .then((data) => {
        console.log(`secret:`)
        console.log(data[0].secret) 
        let KeySign = data[0].secret
        OTAUsersDao.findUser({userId:userId},(err, result)=>{
          return result[0]
        }).then((data) => {
          console.log(data)
          let {username, role} = data
          let user = {username: username, role: role}
          let token = jwt.sign(user, KeySign, {
            expiresIn: 60 * 60 * 24
          })
          res.json({data: [{userId: userId, secret: KeySign, modifiedDate: modifiedDate, token}]})
        })        
      })
    }
  })
})
module.exports = router
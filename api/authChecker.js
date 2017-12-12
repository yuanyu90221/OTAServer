const jwt = require('jsonwebtoken')
const {SECRET} = require('../config/constants.json')
const {info, warn, error} = require('../logger/log4js')
module.exports.checker = (req, res, next) => {
  // ADD jwt token
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  info.info(token)
  let secret = res.locals.secret | SECRET
  if (token) {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.json({err: 'fail to authentication'})
      } else {
        res.locals.decoded = decoded
        info.info(`decoded`, decoded)
        next()
      }
    })
  } else {
    res.status(403).json({err: 'token not provideds'})
  }
}
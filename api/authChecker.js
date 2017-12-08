const jwt = require('jsonwebtoken')
const {SECRET} = require('../config/constants.json')

module.exports.checker = (req, res, next) => {
  // ADD jwt token
  let token = req.body.token || req.query.token || req.headers['x-access-token']
  console.log(token)
  let secret = res.locals.secret | SECRET
  if (token) {
    jwt.verify(token, secret, function(err, decoded) {
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
}
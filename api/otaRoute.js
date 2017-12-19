const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const {OTASecretsDao} = require('../dao/otaSecrets')
const {otaManager} = require('../util/otaManager')
const {client} = require('../redis/index')
// jwt decoded middlewared
const decodeWithSign = (req, res, next) => {
  let {keyNum, payload} = req.body
  keyNum = keyNum || 1
  info.info(`payload: ${payload}, keyNum: ${keyNum}`)
  OTASecretsDao.getCurrentSecret({keyNum:keyNum, isCurrent: true})
  .then(data => {
    if (data && data[0] && data[0].secret) {
      let secret = data[0].secret
      jwt.verify(payload, secret, (err, decoded) => {
        if (err) {
          res.status(403).json({err: err.message})
        }
        else {
          res.locals.decoded = decoded
          info.info(decoded)
          next()
        }
      })
    }
    else {
      res.status(403).json({err: `secret ${keyNum} not found`})
    }
  })
}
// 1 gen challenge with cwid
router.post('/challenge', decodeWithSign, (req, res) => {
  info.info(`challenge`)
  let {keyNum} = req.body
  let {cwid} = res.locals.decoded
  info.info(`cwid: ${cwid}`)
  let challenge = otaManager.derivedRandom()
  client.hmset(cwid, {
    "challenge":  challenge,
    "createDate": new Date()
  } , (err, reply) => {
    if (err) {
      client.quit()
      error.error(`${cwid} challenge gen error ${err.message}`)
      res.status(405).json({err: `${cwid} challenge gen error ${err.message}`})
    }
    else {
      OTASecretsDao.getCurrentSecret({keyNum: keyNum, isCurrent: true}, (err, result)=> {
        if (err) { res.status(403).json({err: err.message})}
      })
      .then((data) => {
        if (data || data[0] || data[0].secret) {
          let {secret} = data[0]
          let token = jwt.sign({challenge: otaManager.genReplyChallenge(challenge)}, secret, {expiresIn: '1h'})
          res.json({challenge: token})
        }
        else {
          res.status(405).json({err:'no secret found'})
        }
      })
    }
  })  
})

// 2 set cryptogram and reply key
router.post('/cryptogram', decodeWithSign, (req, res) => {
  let {cryptogram, cwid} = res.locals.decoded
  info.info(`cryptogram: ${cryptogram} for cwid: ${cwid}`)
  client.hset(cwid, 'cryptogram', `${cryptogram}`, (err, reply) => {
    if (err) {
      client.quit()
      error.error(`${cwid} insert cryptogram gen error ${err.message}`)
      res.status(403).json({err: `${cwid} insert cryptogram gen error ${err.message}`})
    }
    else {
      // get the challenge and crytpgram send back to lamda
      client.hgetall(cwid, (err, result) => {
        info.info(result)
        // FIXME: post to get the allowed message to pass to the client
        // {hostMsg: xxx, cardMsg: xxx, serialNum: xxxx}
      })
      // default expire time 1 day
      client.expire(cwid, 3600*24)
      let {keyNum} = req.body
      OTASecretsDao.getCurrentSecret({keyNum: keyNum, isCurrent: true}, (err, result)=> {
        if (err) {
          error.error(err.message) 
          res.status(403).json({err: err.message})
        }
      })
      .then((data) => {
        if (data || data[0] || data[0].secret) {
          let {secret} = data[0]
          let token = jwt.sign({cryptogram: cryptogram}, secret, {expiresIn: '1h'})
          info.info(`cryptogram: ${token}`)
          res.json({cryptogram: token})
        }
        else {
          res.status(405).json({err:'no secret found'})
        }
      })
    }
  })
})
module.exports = router
const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const {OTACardsDAO} = require('../dao/otaCards')
const {OTASecretsDao} = require('../dao/otaSecrets')
const {otaManager} = require('../util/otaManager')
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
  // /info.info(res.locals)
  // info.info(JSON.stringify(res.locals.decoded))
  let {cwid} = res.locals.decoded
  info.info(`cwid: ${cwid}`)
  let challenge = otaManager.derivedRandom()
  OTACardsDAO.findCardByCwId(cwid).then(data1 => {
    let isUpdate = (data1 && data1[0])? true: false
    OTACardsDAO.upsertCard(cwid, {challenge: challenge}, isUpdate, (err, result) => {
      if (err) { res.status(403).json({err: `${cwid} challenge gen error ${err.message}`})}
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
    })
  })
  
})

// 2 set cryptogram and reply key
router.post('/cryptogram', decodeWithSign, (req, res) => {
  let {cryptogram, cwid} = res.locals.decoded
  info.info(`cryptogram: ${cryptogram} for cwid: ${cwid}`)
  OTACardsDAO.upsertCard(cwid, {cryptogram: cryptogram}, true, (err, result)=> {
    if (err) { res.status(403).json({err: `${cwid} insert cryptogram gen error ${err.message}`}) }
    else {
      let {keyNum} = req.body
      OTASecretsDao.getCurrentSecret({keyNum: keyNum, isCurrent: true}, (err, result)=> {
        if (err) { res.status(403).json({err: err.message})}
      })
      .then((data) => {
        if (data || data[0] || data[0].secret) {
          let {secret} = data[0]
          let token = jwt.sign({cryptogram: cryptogram}, secret, {expiresIn: '1h'})
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
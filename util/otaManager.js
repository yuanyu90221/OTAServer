const crypto = require('crypto')
const INIT_UPDATE_CMD = '80500108'
const INIT_UPDATE_CMD_PAD = '00'
const derivedRandom = () => {
  const buf = crypto.randomBytes(8)
  return `${buf.toString('hex')}`
}
const otaManager = {
  derivedRandom: derivedRandom,
  // first challenge create into db
  genReplyChallenge: (challenge) => {
    // do Fake challenge
    return INIT_UPDATE_CMD + challenge + INIT_UPDATE_CMD_PAD
  }
}

module.exports.otaManager = otaManager
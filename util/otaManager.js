const crypto = require('crypto')
const INIT_UPDATE_CMD = '80500108'
const INIT_UPDATE_CMD_PAD = '00'
const otaManager = {
  // first challenge create into db
  genChallenge: (cwid) => {
    // do Fake challenge
    return INIT_UPDATE_CMD + cwid + INIT_UPDATE_CMD_PAD
  },
  derivedRandom: () => {
    const buf = crypto.randomBytes(8)
    return `${buf.toString('hex')}`
    // return crypto.randomBytes(8, (err, buf) => {
    //   if(err) throw err
    //   return `${buf.toString('hex')}`
    // }) 
  }
}

module.exports.otaManager = otaManager
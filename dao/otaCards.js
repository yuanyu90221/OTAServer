const {info, error, warn} = require('../logger/log4js')
const {OTACards} = require('../models/otaCards')
const OTACardsDAO = {
  // 1 upsert the cardInfo 
  upsertCard: (cwid, updateInfo, isUpdate, callback) => {
    let {challenge, cryptogram} = updateInfo
    let data = {cwid: cwid}
    if (challenge) {
      data.challenge = challenge
    }  
    if (cryptogram) {
      data.cryptogram = cryptogram
    }
    return isUpdate? OTACards.findOneAndUpdate({cwid}, {$set: data}, {new: true}, callback):OTACards.insertMany(data, callback)
  },
  // 2 get the cardInfo by cwid
  findCardByCwId: (cwid, callback) => {
    return OTACards.find({cwid: cwid}, callback)
  }
}

module.exports.OTACardsDAO = OTACardsDAO
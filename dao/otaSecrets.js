const OTAUsers = require('../models/otaUsers').OTAUsers
const OTASecrets = require('../models/otaSecrets').OTASecrets
const counter = require('../models/counter').counter
const {info, error, warn} = require('../logger/log4js')
const OTASecretsDao = {
  upsertSecret: (userId, secret, keyNum, isUpdate, callback) => {
    // check UserId is Valid
    OTAUsers.findOne({userId: userId}).then(data=>{
      info.info(data)
      return data
    }).then(data=>{
      if(data.userId) {
        let insertData = {userId: userId, secret: secret}
        OTASecrets.find({secret: secret}).then(data=>{
          return data
        }).then(data=>{
          info.info(data)
          if(isUpdate || (data && data.length!==0)) {
            console.log('data update')
            info.info('data update')
            return OTASecrets.findOneAndUpdate({userId: userId, keyNum: keyNum}, {$set: {secret: secret, modifiedDate: new Date()}} , callback)
          }
          else {
            console.log('data insert')
            info.info('data insert')
            counter.findByIdAndUpdate({_id:'keyNum'},{$inc: {seq: 1}}).then((data) =>{
              return data.seq
            }).then(seq=> {
              let kNum = seq + 1
              return OTASecrets.insertMany({userId: userId, secret: secret, keyNum: kNum}, callback)
            })            
          }
        })
      }
    }).catch(err => {
      error.error(err.message)
      throw new Error(err.message)
    })
  },
  getSecrets: (userId, callback) => {
    info.info(`${userId}`)
    return OTASecrets.find({userId: userId}, callback)
  },
  getAllSecrets: (callback) => {
    info.info(`get all Secrets`)
    return OTASecrets.find({}, callback)
  },
  getCurrentSecret: (criteria, callback) => {
    info.info(criteria)
    return OTASecrets.find(criteria, callback)
  }
}

module.exports.OTASecretsDao = OTASecretsDao
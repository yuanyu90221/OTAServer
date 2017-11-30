const OTAUsers = require('../models/otaUsers').OTAUsers
const OTASecrets = require('../models/otaSecrets').OTASecrets

const OTASecretsDao = {
  upsertSecret: (userId, secret, callback) => {
    // check UserId is Valid
    OTAUsers.findOne({userId: userId}).then(data=>{
      // console.log(data)
      return data
    }).then(data=>{
      console.log(`next`, !data.userId)
      if(data.userId) {
        let insertData = {userId: userId, secret: secret}
        OTASecrets.find({secret: secret}).then(data=>{
          console.log(`find result1`)
          console.log(data)
          return data
        }).then(data=>{
          console.log(`find result2`)
          console.log(data==[])
          if(data && data.length!==0){
            console.log(`update`)
            return OTASecrets.findOneAndUpdate({userId: userId}, {$set: {secret: secret}} , callback)
          }
          else {
            return OTASecrets.insertMany({userId: userId, secret: secret}, callback)
          }
        })
      }
    })
  }
}

module.exports.OTASecretsDao = OTASecretsDao
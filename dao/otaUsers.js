const OTAUsers = require('../models/otaUsers').OTAUsers
const counter = require('../models/counter').counter
const CodeManager = require('../util/codeManager')
const OTAUsersDao = {
  addUser: (userInfo , callback) => {
    counter.findByIdAndUpdate({_id:'userId'}, {$inc: {seq: 1}}).then(data=>{
      return data.seq
    }).then(seq=>{
      userInfo.userId = seq+1
      return OTAUsers.insertMany(userInfo, callback)
    })
  }
}
module.exports.OTAUsersDao = OTAUsersDao
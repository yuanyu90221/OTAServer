const OTAUsers = require('../models/otaUsers').OTAUsers
const CodeManager = require('../util/codeManager')
let encryptText = CodeManager.encryptIV('coolbitx')
const OTAUsersDao = require('../dao/otaUsers').OTAUsersDao
const OTASecretsDao = require('../dao/otaSecrets').OTASecretsDao
const {SECRET} = require('../config/constants.json')
// OTAUsers
// admin({username:'admin'}, 
// {passwd: encryptText})
// OTAUsers.insertMany({username:'yuanyu'}, 
// {passwd: encryptText}, function(err, result) {
//   console.log(result)
// })
// OTAUsers.add({username:'yuanyu'}, 
// {passwd: encryptText}, function(err, result) {
//   console.log(result)
// })

// OTAUsersDao.addUser({username:'yuanyu'}, 
// {passwd: encryptText}, function(err, result){
//   console.log(result)
// })
OTASecretsDao.upsertSecret(1, SECRET, 1, true, (err, result)=>{
  console.log(result)
})
// const { OTASecrets }  = require('../models/otaSecrets')
// const { OTASecretsDao } = require('../dao/otaSecrets')

const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const OTAUsersDao = require('../dao/otaUsers').OTAUsersDao
// router.use(function (req, res, next){
//   jwt.verify()
// })
router.get('/users', (req, res, next) =>{
  OTAUsersDao.findUser({}, (err, otaUsers) => {
    res.json({data: otaUsers})  
  }).catch((err) => {
    res.json({err: err.message})
  })
})
module.exports = router
const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const OTAUsersDao = require('../dao/otaUsers').OTAUsersDao
const otaSecrets = require('../api/otaSecrets')
const axios = require('axios')
const {OTASecretsDao} = require('../dao/otaSecrets')
// router.get('/sessions', (req, res) => {
//    req.sessions
//    res.json({session: req.session})
// })
// router.use('/', (req, res, next) => {
//   OTASecretsDao.getCurrentSecret({isCurrent:true}, (err, result) => {
//     if(err) {{return res.json({err: err.message})}}
//     if(result[0])
//     {
//       console.log(result[0].secret)
//       global.secret = result[0].secret
//     }
//     next()
//   })
// })
router.get('/users', (req, res, next) =>{
  OTAUsersDao.findUser({}, (err, otaUsers) => {
    res.json({data: otaUsers})  
  }).catch((err) => {
    res.json({err: err.message})
  })
})
router.post('/user', (req, res) => {
  console.log(`req.body`)
  console.log(req.body)
  if(req.body.username && req.body.passwd) {
    return axios.post('http://localhost:7000/api/authenticate',{
        username: req.body.username,
        passwd: req.body.passwd
      }
    ).then((result)=>{
      let data = result.data
      if (data.err) {
        res.json({err: data.err})
      } else {
        req.session.authUser = {username: data.username, role: data.role, token: data.token}
        console.log(req.session)
        res.json({token: data.token, username: data.username, role: data.role})
      }
    }).catch(err=> {
      res.json({err: err.message})
    })
  } else {
    res.status(403).json({err: 'No provided username and passwd'})
  }
})
router.use(otaSecrets)
module.exports = router
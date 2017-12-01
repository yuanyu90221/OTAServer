const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const {info, warn, error} = require('../logger/log4js')
const OTAUsersDao = require('../dao/otaUsers').OTAUsersDao
const otaSecrets = require('../api/otaSecrets')
const axios = require('axios')
router.get('/users', (req, res, next) =>{
  OTAUsersDao.findUser({}, (err, otaUsers) => {
    res.json({data: otaUsers})  
  }).catch((err) => {
    res.json({err: err.message})
  })
})
router.post('/user', (req, res) => {
  console.log(req.body)
  // console.log(req.params)
  // console.log(req.query)
  if(req.body.username && req.body.passwd) {
    return axios.post('http://localhost:7000/api/authenticate',{
        username: req.body.username,
        passwd: req.body.passwd
      }
    ).then((result)=>{
      let data = result.data
      console.log(data)
      if (data.err) {
        res.json({err: data.err})
      } else {
        console.log('before return')
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
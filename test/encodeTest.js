const CodeManager = require('../util/codeManager')
const {passwd} = require('../config/mongoConfig.json')
const jwt = require('jsonwebtoken')
// let result = CodeManager.encrypt(passwd)
// console.log(result)
// console.log(`encrypted result:${result}`)
// console.log(`decrypted result:${CodeManager.decrypt(result)}`)
// console.log(`decrypted result:${CodeManager.decrypt(result)}`)
let result1 = CodeManager.encryptIV('dob770407')
console.log(result1)
let result2 = CodeManager.decryptIV(result1)
console.log(result2)
let tag = result1.tag.toString('base64')
console.log(result1.tag.toString('base64'))
let result3 = {
  content: result1.content,
  tag: new Buffer(tag,'base64')
}
let result4 = CodeManager.decryptIV(result3)
console.log(result4)
let secret = 'd579bf4a2883cecf610785c49623e9'
let secret1 = 'a589bf4a2883cecf610785c49623e1'
let token = jwt.sign({username: 'yuanyu', role: 'admin'}, secret1, {expiresIn: '2h'})
// let token = jwt.sign({cwid:'00112233'}, secret, {expiresIn: '1h'})
console.log(token)
let returnPL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFsbGVuZ2UiOiI4MDUwMDEwODAwMTEyMjMzMDAiLCJpYXQiOjE1MTMwNjA0OTgsImV4cCI6MTUxMzA2NDA5OH0.RkR27Aa0osZf0t8ixj9mBzPHmQ1KB0HvvOIBMTXIdHE'
jwt.verify(returnPL, secret, (err, decoded) => {
   console.log(decoded)
})
let cryptogram =  jwt.sign({cryptogram:'0000726501898398816801020002D9857D532F04A7CA64FD03DE4DCA9000', cwid:'00112233'}, secret1, {expiresIn:'1h'})
console.log(cryptogram)

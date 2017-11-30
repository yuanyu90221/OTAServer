const CodeManager = require('../util/codeManager')
const {passwd} = require('../config/mongoConfig.json')

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
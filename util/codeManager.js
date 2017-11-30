const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
let algorithm1 = 'aes-256-gcm',
    iv = '57b1162ed96',
    passwd = '3zTvzr3p67VC61jmV54rIYu1545x4TlY'  
const {SECRET} = require('../config/constants.json')
const CodeManager = {
  encrypt: (text) => {
    let cipher = crypto.createCipher(algorithm, SECRET)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  },
  decrypt: (text) => {
    let decipher = crypto.createDecipher(algorithm, SECRET)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  },
  encryptIV: (text) => {
    let cipher = crypto.createCipheriv(algorithm1, passwd, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    let tag = cipher.getAuthTag();
    return {
      content: encrypted,
      tag: tag
    }
  },
  decryptIV: (encrypted) => {
    let decipher = crypto.createDecipheriv(algorithm1, passwd, iv)
    decipher.setAuthTag(encrypted.tag)
    let dec = decipher.update(encrypted.content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  }
}
module.exports = CodeManager
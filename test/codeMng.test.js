const CodeManager = require('../util/codeManager')
let encrpyted = "", decrypted = "", tag = "" , decryptedText = ""
describe('CodeManager method test', ()=> {
  // encryptIV
  test('CodeManger.encryptIV("payload")', (done) => {
    encrpyted = CodeManager.encryptIV("payload")
    console.log(encrpyted)
    done()
  })
  // decryptIV
  test('CodeManger.decryptIV("payload")', (done) => {
    decrypted = CodeManager.decryptIV(encrpyted)
    console.log(decrypted)
    done()
  })
  // transfer tag from Buffer to hex
  test('transfer tag from Buffer to hex', (done) => {
    tag = encrpyted.tag.toString('base64')
    console.log(tag)
    done()
  })
  // decryptIV from self implements tag and content
  test('decryptIV from self implements tag and content', (done) => {
    let readyToDecryted = {content: encrpyted.content, tag: new Buffer(tag, 'base64')}
    console.log(readyToDecryted)
    decryptedText = CodeManager.decryptIV(readyToDecryted)
    console.log(decryptedText)
    done()
  })
})
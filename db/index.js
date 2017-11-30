// db connection
const mongoose = require('mongoose')
const Promise = require('bluebird')
let {domainName, port, user, passwd, dbname} = require('../config/mongoConfig.json')
const {info} = require('../logger/log4js')
const CodeManager = require('../util/codeManager')
domainName = domainName || process.env.domainName
port = port || process.env.port
user = user || process.env.user
passwd = passwd || process.env.passwd
dbname = dbname || process.env.dbname
mongoose.Promise = Promise
let DBManager = {
  getConnection: () => {
    info.info(`domainName: ${domainName}, port: ${port}, user: ${user}, passwd: ${passwd.content}
    dbname: ${dbname}`)
    let tag = new Buffer(passwd.tag, 'base64')
    console.log(tag)
    let context = {content: passwd.content, tag: tag}
    let decryptedPasswd = CodeManager.decryptIV(context)
    return mongoose.createConnection(`mongodb://${user}:${decryptedPasswd}@${domainName}:${port}/${dbname}`)
  }
}
module.exports = DBManager
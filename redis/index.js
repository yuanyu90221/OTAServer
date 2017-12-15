const redis = require('redis')
const { HOST, PORT } = require('../config/redisConfig.json')
const {info} = require('../logger/log4js')
// default host:127.0.0.1, default port: 6379
let host = process.env.HOST || HOST
let port = process.env.REDIS_PORT || PORT
const client = redis.createClient(port, host, {
  no_ready_check: true
})
client.on('connect', () => {
  info.info(`redis is running on ${host}:${port}`)
})
module.exports.client = client
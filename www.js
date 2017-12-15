const app = require('./server')
const port = process.env.PORT || 7000
const {info} = require('./logger/log4js')
app.set('port', port)
app.listen(port, (status) => {
  info.info(`OTAServer is on ${port}`)
})
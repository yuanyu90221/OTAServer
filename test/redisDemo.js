const {client} = require('../redis/index')

// client.del('0213123')
// client.del('0213124')
client.hmset('0213123', {
  'challenge': '2131312313',
  'updateDate': Date.now()
})
client.hmset('0213124', {
  'challenge': '2131312313',
  'updateDate': Date.now()
})
// retrieve all data in set
client.hgetall('0213123', (err, obj) => {
  console.log(obj)
})
client.hgetall('0213124', (err, obj) => {
  console.log(obj)
})
// // append data to the same key 
client.hset('0213123', 'crytopgram', '02321312312')
client.hset('0213124', 'crytopgram', '02321312312')
// client.keys('*', (err, result) => {
//   console.log(result)
//   client.quit()
// })
client.expire('0213123', 20)
client.hgetall('0213123', (err, obj) => {
  console.log(obj.challenge)
  console.log(obj.crytopgram)
  // client.quit()
})
setTimeout(function () {
  client.exists('0213123', (err, reply) => {
    console.log(reply)
  })
}, 20000)

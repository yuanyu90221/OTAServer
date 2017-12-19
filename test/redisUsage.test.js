const {client} = require('../redis/index')

describe('redis usage test', () => {
  test('flushall delete all data in all db', (done) => {
    client.flushall((err, reply) => {
      if (!err) { // this would be work if redis server is on
        console.log(reply)
        done()
      } 
    })
  })
  // set with object data
  test('hmset 0213124 with {"challenge":"2131312313","updateDate": new Date()}', (done) => {
    client.hmset('0213124', {
      'challenge': '2131312313',
      'updateDate': Date.now()
    },(err, reply) => {
      if (!err) { // this would be work if redis server is on
        console.log(reply)
        done()
      } 
    })
  })
  // append data 
  test('hset 0213124 with {"cryptogram":"02321312312"}', (done) => {
    client.hset('0213124', 'challenge', '2131312313', (err, reply) => {
      if (!err) { // this would be work if redis server is on
        done()
      } 
    })
  })
  // retrive data with key 0213124
  test('hgetall 0213124', (done) => {
    client.hgetall('0213124', (err, replyObj) => {
      if (!err) { // this would be work if redis server is on
        console.log(replyObj)
        done()
      } 
    })
  })

  // expires data with key 0213124 within 20s
  test('expire key 0213124 in 20s', (done) => {
    client.expire('0213124', 20, (err, replyNum) => {
      if (!err) { // this would be work if redis server is on
        console.log(replyNum)
        done()
      } 
    })
  })
  // retrive key 0213124 after 2s , if after 20s will error with time out
  test('retrive key 0213124 after 2s', (done) => {
    setTimeout(()=> {
      client.hgetall('0213124', (err, replyObj) => {
        if (!err) {
          console.log(replyObj)
          done()
        }
      })
    }, 2000)
  })
})
const server = require('../server.js')
// const jest = require('jest')
const superagent = require('supertest')
const app = server.listen(8100)
const jwt = require('jsonwebtoken')
// this would be the right SECRET if the DB store the same secret with constants.json
const {SECRET} = require('../config/constants.json')
function request() {
  return superagent(app)
}

afterAll(() => {
  app.close()
})

describe('OTAs API TEST', () => {
  test('/api/challenge', (done) => {
    let token = jwt.sign({cwid: '00112233'}, SECRET, {expiresIn: 60*60*24})
    request()
    .post('/api/challenge')
    .send({keyNum: 1, payload: token})
    .then((response) => {
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('challenge')
      done()
    })
  })

  test('/api/cryptogram', (done) => {
    
    getCryptogram(SECRET, done)
  })
})

const getCryptogram = (secret, done) => {
  let token =  jwt.sign({cryptogram:'0000726501898398816801020002D9857D532F04A7CA64FD03DE4DCA9000', cwid:'00112233'}, secret, {expiresIn:'1h'})
  request()
  .post('/api/cryptogram')
  .send({keyNum: 1, payload: token})
  .then((response) => {
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('cryptogram')
    done()
  })
}
const server = require('../server.js')
const superagent = require('supertest')
const app = server.listen(8200)
const jwt = require('jsonwebtoken')
// this would be the right SECRET if the DB store the same secret with constants.json
const {SECRET} = require('../config/constants.json')

function request() {
  return superagent(app)
}

afterAll(() => {
  app.close()
})

let token = ''
describe('jwt auth API TEST', () => {
  test('/api/user', (done) => {
      request()
      .post('/api/user')
      .send({username:'yuanyu', passwd:'dob770407'})
      .then((response) => {
        expect(response.statusCode).toBe(200)
        // console.log(response.body)
        token = response.body.token
        expect(response.body).toHaveProperty('token')
        done()
      })
  })

  test('/api/sessionsStatus', (done) => {
    request()
    .post('/api/sessionsStatus')
    .send({username:'yuanyu'})
    .then((response) => {
      expect(response.statusCode).toBe(200)
      done()
    })
  })

  test('/api/getAllSecrets', (done) => {
    request()
    .get('/api/getAllSecrets')
    .set('x-access-token', token)
    .then((response) => {
      expect(response.statusCode).toBe(200)
      console.log(response.body)
      expect(response.body).toHaveProperty('data')
      done()
    })
  })
})
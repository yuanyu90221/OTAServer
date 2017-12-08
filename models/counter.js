const mongoose = require('mongoose')
const {Schema} = mongoose
const {getConnection} = require('../db')
const conn = getConnection()
const CounterSchema = Schema({
  _id: {type: String, required: true},
  seq: {type: Number, default: 0}
}, {
  versionKey: false
})
const counter = conn.model('counter', CounterSchema, 'counter')
module.exports.counter = counter
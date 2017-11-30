const mongoose = require('mongoose')
const {Schema} = mongoose
const {getConnection} = require('../db')
const conn = getConnection()
const schema = new Schema({
  username: {
    type: String,
    require: true
  },
  passwd: {
    type: String,
    require: true
  },
  role: {
    type: String,
    require: true,
    default: 'admin'
  },
  userId: {
    type: Number,
    require: true,
    default: 0
  },
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.passwd
      delete ret.__v
    }
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.passwd
      delete ret.__v
    }
  }
})
const OTAUsers = conn.model('OTAUsers', schema, 'otaUsers')
module.exports.OTAUsers =  OTAUsers
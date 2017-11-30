const mongoose = require('mongoose')
const {Schema} = mongoose
const {getConnection} = require('../db')
const conn = getConnection()
const schema = new Schema({
  secret: {
    type: String,
    require: true
  },
  userId: {
    type: Number,
    require: true,
    default: -1
  },
  modifiedDate: {
    type: Date,
    require: true,
    default: new Date()
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id
    }
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
    }
  }
})
const OTASecrets = conn.model('OTASecrets', schema, 'otaSecrets')
module.exports.OTASecrets =  OTASecrets
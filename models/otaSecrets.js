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
  },
  isCurrent: {
    type: Boolean,
    require: true,
    default: false
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
    }
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret._id
      delete ret.__v
    }
  }
})
const OTASecrets = conn.model('OTASecrets', schema, 'otaSecrets')
module.exports.OTASecrets =  OTASecrets
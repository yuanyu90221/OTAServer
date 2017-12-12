const mongoose = require('mongoose')
const {Schema} = mongoose
const {getConnection} = require('../db')
const conn = getConnection()
const schema = new Schema({
  cwid: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    require: true,
    default: Date.now()
  },
  challenge: {
    type: String,
    default: null
  },
  cryptogram: {
    type: String,
    default: null
  },
  isExpired: {
    type: Boolean,
    required: true,
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
}, {
  versionKey: false
})
const OTACards = conn.model('OTACards', schema, 'otaCards')
module.exports.OTACards = OTACards
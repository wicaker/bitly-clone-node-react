const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackerSchema = new Schema({
  shortUrlId: {
    type: Schema.Types.ObjectId,
    ref: 'shorters'
  },
  refferrerUrl: String,
  ipAdress: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = Shorter = mongoose.model('trackers', TrackerSchema);
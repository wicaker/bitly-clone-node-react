const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShorterSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String
  },
  originalUrl: {
    type: String
  },
  urlCode: String,
  shortUrl: String,
  totalClicks: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = Shorter = mongoose.model("shorters", ShorterSchema);

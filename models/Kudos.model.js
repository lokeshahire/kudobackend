const mongoose = require("mongoose");

const KudosSchema = new mongoose.Schema({
  giver: { type: String, required: true },
  recipient: { type: String, required: true },
  badge: { type: String, required: true },
  reason: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model("KudosModel", KudosSchema);

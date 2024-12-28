const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kudos: { type: Number, default: 0 },
  pass: { type: String, required: true },
});

module.exports = mongoose.model("UserModel", userSchema);

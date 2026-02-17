const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  googleId: String,

  // ⭐ NEW FIELD
  profileImage: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("User", userSchema);
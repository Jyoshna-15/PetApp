const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  password: String,
  googleId: String,

  profileImage: {
    type: String,
    default: "",
  },

  // ⭐ FAVORITES ARRAY
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet"
    }
  ]

});

module.exports = mongoose.model("User", userSchema);

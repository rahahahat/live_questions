const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  //Currently storing room by reference rather than embedding users in room scheme like questions
  //This may need to change depending on how we need to access user data for authentication
  room: {
    type: mongoose.Schema.Types.ObjectId
  },
  token: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);

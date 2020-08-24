const mongoose = require("mongoose");
const Question = require("./question");
const questionSchema = mongoose.model("Question").schema;

//Database model for an room (room)
const roomSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],

  //-----settings-----
  profanityFilter: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);

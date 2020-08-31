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
  title: {
    type: String,
    required: true,
    default: "Title",
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
  password: {
    type: String,
    required: false,
  },
  //-----settings-----
  requirePassword: {
    type: Boolean,
    default: false,
  },
  profanityFilter: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Room", roomSchema);

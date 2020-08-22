const mongoose = require('mongoose')
const Question = require("./question")
const questionSchema = mongoose.model('Question').schema

//Database model for an instance (room)
const instanceSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
})

module.exports = mongoose.model('Instance', instanceSchema)
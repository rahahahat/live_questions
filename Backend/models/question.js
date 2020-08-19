const mongoose = require('mongoose')

//Database model for a question in an instance
const questionSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Question', questionSchema)
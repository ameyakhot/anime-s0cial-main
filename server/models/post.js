const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "Default Image"
    },
    // building relationship between Usermodel and post model
    postedBy: {
        type: ObjectId, 
        ref: "User"
    }
})

mongoose.model("Post", postSchema)
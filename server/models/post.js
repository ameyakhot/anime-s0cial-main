const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    body: {
        type: String,
        required:true
    },
    image: {
        type: String, // because the URL of image is stored.
        required: true
        // default: "No Photo"
    },
    // postedBy is used to build relation with mongoDB from one schema to another
    postedBy:{ 
        type: ObjectId,
        ref: "User" // From the User Model
    }
})

mongoose.model('Post', postSchema)
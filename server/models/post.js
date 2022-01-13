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
    },
    likes: [{
        type: ObjectId, // because each individual id who like these posts will be stored in this array
        ref: "User" // User model is the reference
    }],
    comments: [{
        text: String,
        postedBy: {
            type: ObjectId,
            ref: 'User'
        }
    }]
})

mongoose.model('Post', postSchema)
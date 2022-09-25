const express = require('express');
const mongoose = require('mongoose')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
// const Post = mongoose.model('Post')
const Post = mongoose.model("Post")

router.get('/feed', (req, res) => {
    Post.find()
        // populate postedBy and get only _id and name
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => console.log(err))
})

router.post('/create-post', requireLogin, (req, res) => {
    const {title, body} = req.body
    if (!title || !body){
        res.status(422).json({
            error: "Please add all fields! "
        })
    }
    // to remove password from showing to user screen
    req.user.password = undefined
    
    // create post data variable
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })

    // store post in database and chain reactions
    post.save()
        .then(result => {
            res.json({
                post: result
            })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/profile', requireLogin, (req, res) => {
    // get only posts of user._id
    Post.find({postedBy: req.user._id})
        .populate("postedBy", "_id name")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => console.log(err))
})

module.exports = router
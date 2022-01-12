const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.post('/createpost', requireLogin, (req, res)=> {
    // console.log(req.body)
    // console.log('Inside Create post route')
    const {title, body, image} = req.body
    // console.log(title, body, image)
    if(!title || !body || !image){
        return res.status(422).json({
            Error: "Please add all fields."
        })
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        image,
        postedBy: req.user
    })
    post.save()
    .then(result => {
        res.json({
            post: result
        })
    })
    .catch(err => {
        console.log("Err", err)
    })
})

// feed will contain all the pictures posted by all users on the application
// feed is allposts 
router.get('/feed', requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id name") //helps in expanding the data to with attribute postedBy in Post model
    .then(posts=> {
        res.json({
            posts
        })
    })
    .catch(err=>{
        console.log("Error", err)
        // res.json({
        //     err
        // })
    })
})

//myposts gives all personal posts 
router.get('/myposts', requireLogin, (req, res) => {
    // console.log(req.user)
    Post.find({
        postedBy:req.user._id
    })
    .populate("postedBy","_id name")
    .then(myposts=>{
        res.json({
            myposts
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router
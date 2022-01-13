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

// for update request, put can be used.
router.put('/like', requireLogin, (req, res)=> {
    // console.log(req.body)
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{
            likes: req.user._id
        }
    }, 
    {
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json(
                {
                error: err
            })
        }
        res.json(result)
    })
})

router.put('/unlike', requireLogin, (req, res)=> {
    // console.log(req.body)
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{
            likes: req.user._id
        }
    }, 
    {
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json(
                {
                error: err
            })
        }
        res.json(result)
    })
})

router.put('/comment', requireLogin, (req, res)=> {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    // console.log(req.body)
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{
            comments: comment
        }
    }, 
    {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if(err){
            return res.status(422).json(
                {
                error: err
            })
        }
        res.json(result)
    })
})

// #32
// this delete shoule be inside profile when you open an image and see all its 
// information present there. Then you delete. Deleting from social feed isn't good.
// the :postId is the postId sent in the url itself as a parameter
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({
        _id: req.params.postId
    })
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({
                error: err
            })
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json({
                    message: "Post Deleted Successfully"
                })
            })
            .catch(e => console.log(e))
        }
    })
})

// feed will contain all the pictures posted by all users on the application
// feed is allposts 
router.get('/feed', requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id name") //helps in expanding the data to with attribute postedBy in Post model
    .populate("comments.postedBy", "_id name")
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
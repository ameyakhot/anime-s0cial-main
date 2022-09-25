const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const keys = require('../keys')

router.get('/protected', requireLogin, (req, res) => {
    res.send("Protected")
})


router.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    if(!email || !password || !name){
        return res.status(422).json({
            error: "Please add all fields!"
        })
    }
    User.findOne({email : email})
        .then((savedUser) => {
            if(savedUser){
                return res.status(422).json({
                    error: "User already exists!"
                })
            }
            // hashing the password
            bcrypt.hash(password, 15)
                .then(hashedPassword => {
                    const user = new User({
                        email, 
                        name, 
                        password : hashedPassword
                    })
                    user.save()
                        .then(user => {
                            res.json({message: "Created user!"})
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        res.status(422).json({
            error: "Please provide with email or password."
        })
    }
    User.findOne({email})
        .then(savedUser => {
            if(!savedUser){
                res.status(422).json({
                    error: "Invalid email or password."
                })
            }
            // comparing password with saved user in Mongo
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){

                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                        res.json({
                            token,
                            message: "Signed in!"
                        })
                    }
                    else {
                        return res.json({
                            error: "Invalid email or password."
                        })
                    }
                })
                
        })
        .catch(err => console.log(err))
})

module.exports = router
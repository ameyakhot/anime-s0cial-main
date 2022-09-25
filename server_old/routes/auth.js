const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const keys = require('../config/keys')

router.get('/', (req, res) => {
    res.send('Root Page')
})

// Protected route was made for validation of token with the authorization token 
// router.get('/protected',requireLogin, (req, res)=>{
//     res.send('Hello User.')
// })

router.post('/signup', (req, res) => {
    const {name, email, password} = req.body
    if(!email || !password || !name){
        return res.status(422).json({ 
            error: "Please check all fields."
        })
    }

    // if(password.length <= 8 || )
    User.findOne({
        email
    }).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({
                error: "User already exists."
            })
        }
        else{
            bcrypt.hash(password, 12).then(hashedPassword => { // adding bcrypt to hash the passwords and add a 12 alphanumeric hash instead of it to the database
                const user = new User({
                    name,
                    email,
                    password:hashedPassword
                })
                user.save()
                .then(
                    user=>{
                        res.json({
                            message: "Used registered Successfully."
                        })
                    }
                )
                .catch(err => {
                    console.log(err)
                })
            })
        }
    })
    .catch(err => {
        console.log(err)
    })
    // Assigning the email tag in the User Json from the destructuring from req.body
})

router.post('/signin', (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){ 
        return res.status(422).json({
            error: "Please provide complete fields"
        })
    }
    else{
        User.findOne({
            email: email
        }).then(savedUser => {
            if(!savedUser){
                return res.status(422).json({
                    error: "Invalid email address."
                })
            }
            else{
                bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        // res.json({
                        //     message: "Login Successful"
                        //     })
                        const token = jwt.sign({
                            _id: savedUser._id
                        }, JWT_SECRET)
                        const {_id, name, email} = savedUser
                        res.json({token, user:{_id,name, email}})
                        }
                    else{
                        return res.status(422).json({
                            error: "Invalid password."
                        })
                    }
                })
                .catch(err => {
                    console.log("Error", err)
                })
            }
        })
    }
})

// Now when the user sucessfully signs inside the app, we should provide him with a token
// This token can be done by JWT token. 
// This is required so that the used can access resources that are restricted.

module.exports = router
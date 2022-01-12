const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 4000
const {MONGOURI}= require('./keys')


mongoose.connect(MONGOURI)

mongoose.connection.on('connected', function(){
    console.log('Connected to MongoDB Atlas')
})

mongoose.connection.on('error', function(err){
    console.log("Error: ", err)
})

require('./models/user') // Not stored in a const because it wasn't exported as a model from user.js in models folder
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))

// const customMiddleware = (req, res, next) => {
//     console.log('MW Exec')
//     next() 
// } 

// // Middleware executes for every route
// // Next() is used to continue the flow to the next middleware or to continue the flow to the '/' route
// // Middleware intercepts the incoming request and modifies it before it 
// // reaches to actual route handler.

// // app.use(customMiddleware) // Use only if you want to use the middleware for all routes.

// // If there is anything beyond the '/' like '/home' we need to use a route handler
// // app.get('/',(req, res)=>{

// app.get('/',(req, res)=>{ // when I put the middleware to not be applied to a specific route, define in that function and then call it
//     console.log('home')
//     res.send('hello world')
// })

// // So when we run the localhost, the output comes as:
// // MW Executed
// // Home
// // This means, we will the middleware is executed every time when we run the / route

// app.get('/about', customMiddleware, (req, res)=>{
//     console.log('about')
//     res.send('about page')
// })

// // So when we run the localhost, the output comes as:
// // MW Executed
// // About
// // This means, we will the middleware is executed every time when we run the /about route


// // When localhost:5000 is called, it means the end user has made a request 
// // to '/' route which the root route of this page.

// //Here, the res.send(hello world) runs on the localhost:5000

app.listen(port, ()=>{
    console.log("Server is running on", port)
}) 
// This is seen when the node server runs from the console after sayinig 'node app.js'
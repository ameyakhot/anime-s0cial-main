// const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
app = express()
const {MONGOURI} = require('./keys')
const hostname = '127.0.0.1'
const port = 8000



// Mongo Atlas Connection
mongoose.connect(MONGOURI)
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo')
})
mongoose.connection.on('error', (err) => {
  console.log('Err', err)
})

// Register models to app.js
require("./models/user")
require("./models/post")

// parsing data to JSON
app.use(express.json())

// Register Routes to app.js
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


// Run the host on webserver
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});

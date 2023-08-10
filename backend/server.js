const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

// Connecting with mongo db
mongoose
  .connect('mongodb://127.0.0.1:27017/commentdb')
  .then((x) => {
    console.log(`Connected to ${x.connections[0].name}`)
  })
  .catch((err) => {
    console.error('Error occurs while connecting to the database, ', err.reason)
  })

// Setting up port with express js
const commentRoute = require('./routes/comment.route')
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())
app.use('/comments/', commentRoute)

// Create port
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('Server is listening to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(console.error("Oops! error occurs"))
})

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message) // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500 // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message) // All HTTP requests must have a response, so let's send back an error with its status code and message
})

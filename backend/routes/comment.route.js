const express = require('express')
const commentRoute = express.Router()

const commentsController = require("../controllers/comment.controller.js");

// Add Comment
commentRoute.route('/').post(commentsController.create)

// Get All comments
commentRoute.route('/').get(commentsController.find)

// Get single comment
commentRoute.route('/:id').get(commentsController.findById)

// Get single comment by flight id
commentRoute.route('/byflightid/:flightId').get(commentsController.findByFlightId)

// Update comment
commentRoute.route('/:id').put(commentsController.findByIdAndUpdate)

// Delete comment
commentRoute.route('/:id').delete(commentsController.findByIdAndRemove)

module.exports = commentRoute

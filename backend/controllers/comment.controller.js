// Comment model
let Comment = require('../models/Comment')

// Add Comment
exports.create = (req, res) => {
    Comment.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
}

// Get All comments
exports.find = (req, res) => {
    Comment.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
}

// Get single comment
exports.findById = (req, res) => {
    Comment.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
}


// Get single comment by flight id
exports.findByFlightId = (req, res) => {
    Comment.find({flightId: req.params.flightId})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving comments."
            });
        });
}

// Update comment
exports.findByIdAndUpdate = (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        (error, data) => {
            if (error) {
                console.log(error)
                return next(error)
            } else {
                res.json(data)
                console.log('Data updated successfully')
            }
        },
    )
}

// Delete comment
exports.findByIdAndRemove = (req, res) => {
    Comment.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json({
                msg: data,
            })
        }
    })
}

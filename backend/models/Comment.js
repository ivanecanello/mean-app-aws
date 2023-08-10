const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Comment = new Schema({
   comment: {
      type: String,
      required: [true, 'comment is a required field']
   },
   userId: {
      // If user was another table, we could link the schemas and return more user data everytime we consume adn retrieve comments
      // to show, for example, the name of the user in the comments table
      type: String,
      required: [true, 'userId is a required field']
   },
   flightId: {
      type: String,
      required: [true, 'flightId is a required field']
   },
   tags: {
      type: [String]
   }
}, {
   collection: 'comments'
}, {
   timestamps: true
})

Comment.method("toJSON", function() {
   const { __v, _id, ...object } = this.toObject();
   object.id = _id;
   return object;
});

module.exports = mongoose.model('Comments', Comment)

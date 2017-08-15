// ****************** Dependencies ******************
//---------------------------------------------------
var mongoose = require("mongoose");
const moment = require('moment');

// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var CommentSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Just a string
  body: {
    type: String
    default: moment().format('MMM Do YYYY, h:mm A')
  }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes. These ids are referred to in the Article model

// Create the Comment model with the CommentSchema
var Comments = mongoose.model("Comments", CommentSchema);

// Export the Note model
module.exports = Comments;

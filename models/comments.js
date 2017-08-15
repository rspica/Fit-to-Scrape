// Require mongoose
var mongoose = require("mongoose");
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
  }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes. These ids are referred to in the Article model

// Create the Comment model with the CommentSchema
var Comments = mongoose.model("Comments", CommentSchema);

// Export the Note model
module.exports = Comments;

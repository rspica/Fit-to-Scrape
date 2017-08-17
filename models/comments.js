// ****************** Dependencies ******************
//---------------------------------------------------
var mongoose = require("mongoose");
// const moment = require('moment');

// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var CommentSchema = new Schema({
    
    title: {
        type: String
    },
    
    body: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }

});

// Mongoose saves the ObjectIds of the comments. These ids are referred to in the Article model (see line 29 articles.js)

// Create the Comment model with the CommentSchema
var Comments = mongoose.model("Comments", CommentSchema);

// Export the Note model
module.exports = Comments;
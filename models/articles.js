// ****************** Dependencies ******************
//---------------------------------------------------
const mongoose = require('mongoose');

// Create Schema class
const Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // Recipe title (a required string)
  title: {
    type: String,
    required: true
  },
  // link to the recipe url (a required string)
  link: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  // This only saves one comment's ObjectId, ref refers to the comment model
  comment: {
    type: Schema.Types.ObjectId,
    ref: "comment"
  }
});

// Create the Article model with the ArticleSchema
var Articles = mongoose.model('Articles', ArticleSchema);

// Export the model
module.exports = Articles;

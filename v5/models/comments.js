var mongoose = require("mongoose");

//SCHEMA SETUP
var commentsSchema = new mongoose.Schema({
    text: String,
    author: String
});

module.exports = mongoose.model("Comments", commentsSchema);

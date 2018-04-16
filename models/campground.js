var mongoose = require("mongoose");

//Schema Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: String,
  location: String,
  lat: Number,
  lng: Number,
  description: String,
  author: {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    }
  ]
});

//the db name will automatically pluralize to campgrounds with this setup
module.exports = mongoose.model("Campground", campgroundSchema);

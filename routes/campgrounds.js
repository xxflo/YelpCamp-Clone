var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
  //need to get all campgrounds from DB collection
  Campground.find({},function(err, allCampgrounds){
    if(err){
      console.log(err);
    }else{
      res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser:req.user});
    }
  });
});

//Create - add new campgrounds to DB
router.post("/", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image}
    // now we create new campground and save to the database
    Campground.create(newCampground, function(err, newCamp){
      if(err){
        console.log(err);
      }else{
        res.redirect("/campgrounds");
      }
    });
    //redirect back to campgrounds page
});

//NEW - Get: display form to create new campground
router.get("/new", function(req, res){
  // form in new.ejs submit to the post campgrounds yelp
   res.render("campgrounds/new");
});

//SHOW - Get:showing info for campground with id
router.get("/:id", function(req, res){
  // find the campground with provided ID, render show page with that campground
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else{
      res.render("campgrounds/show",{campground: foundCampground});
    }
  });

});

module.exports = router;

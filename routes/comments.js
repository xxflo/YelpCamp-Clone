var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//===============
//Comment routes
//===============
//check if user's login, if yes, proceed to the callback
//Comments new
router.get("/new", isLoggedIn, function(req,res){
  //find campground by Id
  Campground.findById(req.params.id,function(err, campground){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {campground: campground});
    }
  })
});

//Comments create
router.post("/", isLoggedIn, function(req,res){
  //lookup campground using ID, create new comment, connect new comment to campground
  //redirect to show page
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      // we can do this because we grouped the comment in ejs, it's already an object with required fields
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        }else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;

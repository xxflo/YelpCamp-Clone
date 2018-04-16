var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//===============
//Comment routes
//===============
//check if user's login, if yes, proceed to the callback
//Comments new
router.get("/new", middleware.isLoggedIn, function(req,res){
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
router.post("/", middleware.isLoggedIn, function(req,res){
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
          req.flash("error", "Something went wrong");
          console.log(err);
        }else{
          // add user name and id to comments
          // console.log(req.user.username);
          // console.log(req.user._id);
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success","Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Edit Route
// we defined what params.id is in app.js
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err){
      res.redirect("back");
    }else{
      res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
    }
  });
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,foundComment){
    if(err){
      res.redirect("back");
    }else{
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("/campgrounds/" + req.params.id);
    }else{
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;

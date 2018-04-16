// all the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

//middleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        if (!foundCampground) {
          req.flash("error", "Item not found.");
          return res.redirect("back");
        }else if(foundCampground.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "You don't have permission to do that");
          res.redirect(back);
        }
      }
    });
  }else{
    req.flash("error", "You have to log in to do that");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function (req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect("back");
      } else {
        if (!foundComment) {
          req.flash("error", "Item not found.");
          return res.redirect("back");
        }else if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          req.flash("error", "You don't have permission to do that");
          res.redirect(back);
        }
      }
    });
  }else{
    req.flash("error", "You have to log in to do that");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You have to log in to do that");
  res.redirect("/login");
}

module.exports = middlewareObj;

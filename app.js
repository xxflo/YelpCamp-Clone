require("dotenv").config();

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://xxflo:ginflo@ds257589.mlab.com:57589/yelp-camp--clone");

app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();

//Passport Configuration
app.use(require("express-session")({
  secret: "Hello from ginflo",
  resave: false,
  saveUnintialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//user.authenticate comes with passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//locals would be whatever inside our ejs templates
//added to every route and every template so we have access
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//append the given prefix to given routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(5000, function(){
   console.log("The YelpCampClone Server Has Started!");
});

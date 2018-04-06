var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

//append the given prefix to given routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(5000, function(){
   console.log("The YelpCampClone Server Has Started!");
});

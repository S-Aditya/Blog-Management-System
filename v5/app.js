var express                 = require("express");
var app                     = express();
var User                    = require("./models/user.js")
var passport                = require("passport");
var mongoose                = require("mongoose");
var bodyParser              = require("body-parser");
var localStrategy           = require("passport-local");
var Campground              = require("./models/campgrounds");
//var seedDB                  = require("./seeds");
var Comments                = require("./models/comments");
var passportLocalMongoose   = require("passport-local-mongoose");
var campgroundRoutes        = require("./routes/campgrounds")
var commentRoutes           = require("./routes/comments")
var indexRoutes             = require("./routes/index")
const { urlencoded }        = require("body-parser");

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});

//seedDB();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "I am watching ultimate spider man nowadays",
    resave: false,
    saveUninitialized: false
}))
  
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    return next();
})

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


app.listen("3000",function () {
    console.log("Server started at port 3000");
})
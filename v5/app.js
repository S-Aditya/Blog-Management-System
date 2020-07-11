var express                 = require("express");
var app                     = express();
var User                    = require("./models/user.js")
var passport                = require("passport");
var mongoose                = require("mongoose");
var bodyParser              = require("body-parser");
var localStrategy           = require("passport-local");
var Campground              = require("./models/campgrounds");
var seedDB                  = require("./seeds");
var Comments                = require("./models/comments");
var passportLocalMongoose   = require("passport-local-mongoose");
const { urlencoded }        = require("body-parser");

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});

seedDB();

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

app.get("/",function (req,res) {
    res.render("landing");
})

//INDEX - Show all campgrounds
app.get("/campgrounds",isLoggedIn,function (req,res) {
    //get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds) {
        if(err)
        console.log("dikkat");
        else
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
    });
});

//CREATE - adds new camps to the DB
app.post("/campgrounds",isLoggedIn, function(req,res) {
    
    //get data from form and add to campgrounds array
    
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    console.log(req.body);
    
    var newCampground = {name: name, image: image, description: desc};
                                                                      
    //create a new campground and save to the DB 
    Campground.create(newCampground,function (err,newlyCreate) {
        if(err){
            console.log("Error!");
        }
        else{
            //console.log(newCampground);

            res.redirect("/campgrounds");
        }
    })
});

//NEW - shows form for inserting new route
app.get("/campgrounds/new",isLoggedIn,function (req,res) {
    res.render("campgrounds/new");
})

//SHOW ROUTE
app.get("/campgrounds/:id",isLoggedIn, function(req, res) {
    //find the campground with the required id
    //and show template with that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err,match) {
        if(err)
        console.log("Error in id route");
        else
        {
            res.render("campgrounds/show",{match: match});
        }
    })
})

//=========================================
//          COMMENTS ROUTE
//=========================================

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res) {
    Campground.findById(req.params.id,function(err,match) {
        if(err)
        console.log(err);
        else
        res.render("comments/new",{match: match});
    })
})

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res) {
    Campground.findById(req.params.id,function(err,campground) {
        if(err)
        console.log("err");
        else{
            Comments.create(req.body.post,function(err,comment) {
                
                if(err)
                console.log("dfdsf");
                else{
                    campground.comments.push(comment);

                    campground.save(function(err,doc) {
                        if(err)
                        console.log("babla ki jai ho!");
                        else{
                            console.log(doc);
                            res.redirect("/campgrounds/"+req.params.id);
                        }
                    })
                }  
            })
        }
    })
})

//==============================
//  REGISTER ROUTES
//==============================

app.get("/register",function(req,res) {
    res.render("register");
})

app.post("/register",function(req,res) {
    User.register(new User({username: req.body.username}),req.body.password,function(err,user) {
        if(err)
        {
            console.log(err);
            res.render("register");
        }
        else
        {
            passport.authenticate("local")(req,res,function() {
                res.redirect("/campgrounds");
            })
        }
    })
})

//==============================
//  LOGIN ROUTES
//==============================

app.get("/login",function(req,res) {
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
    
})

//==============================
//  LOGOUT ROUTES
//==============================

app.get("/logout",function(req,res) {
    req.logout();
    res.redirect("/");
})

//Middleware verifying whether a user is logged in or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();

    return res.redirect("/login");
}


//==============================
//  START THE SERVER
//==============================

app.listen("3000",function () {
    console.log("Server started at port 3000");
})
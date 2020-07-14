var express = require("express");
var Campground = require("../models/campgrounds")
var router = express.Router({mergeParams: true});

//INDEX - Show all campgrounds
router.get("/campgrounds",function (req,res) {
    //get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds) {
        if(err)
        console.log("dikkat");
        else
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
    });
});

//CREATE - adds new camps to the DB
router.post("/campgrounds",isLoggedIn, function(req,res) {
    
    //get data from form and add to campgrounds array
    
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    var author = {
        id: req.user._id,
        username: req.user.username
    }

    // console.log(req.body);
    
    var newCampground = {name: name, image: image, description: desc,author: author};
                                                                      
    // create a new campground and save to the DB 
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
router.get("/campgrounds/new",isLoggedIn,function (req,res) {
    res.render("campgrounds/new");
})

//SHOW ROUTE
router.get("/campgrounds/:id",isLoggedIn, function(req, res) {
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

//Middleware verifying whether a user is logged in or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();

    return res.redirect("/login");
}

module.exports = router;
var express = require("express");
var Campground = require("../models/campgrounds")
var Comments = require("../models/comments")
var router = express.Router();

router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res) {
    Campground.findById(req.params.id,function(err,match) {
        if(err)
        console.log(err);
        else
        res.render("comments/new",{match: match});
    })
})

router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res) {
    Campground.findById(req.params.id,function(err,campground) {
        if(err)
        console.log("err");
        else{
            Comments.create(req.body.post,function(err,comment) {
                
                comment.author.username=req.user.username;
                comment.author.id=req.user._id;

                comment.save();

                // console.log(comment.author);
                
                if(err)
                console.log("dfdsf");
                else{
                    campground.comments.push(comment);

                    campground.save(function(err,doc) {
                        if(err)
                        console.log("babla ki jai ho!");
                        else{
                            // console.log(doc);  
                            res.redirect("/campgrounds/"+req.params.id);
                        }
                    })
                }  
            })
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
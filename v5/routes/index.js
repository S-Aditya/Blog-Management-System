var express = require("express");
var User = require("../models/user")
var passport = require("passport")
var router = express.Router();

router.get("/",function (req,res) {
    res.render("landing");
})

router.get("/register",function(req,res) {
    res.render("register");
})

router.post("/register",function(req,res) {
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

router.get("/login",function(req,res) {
    res.render("login");
})

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
    
})

//==============================
//  LOGOUT ROUTES
//==============================

router.get("/logout",function(req,res) {
    req.logout();
    res.redirect("/");
})

//Middleware verifying whether a user is logged in or not
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();

    return res.redirect("/login");
}

module.exports = router;
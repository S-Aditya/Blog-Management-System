var express = require("express");

var app = express();

var bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");

app.get("/",function (req,res) {
    res.render("landing");
})

var campgrounds = [
    {name: "Salmon Creek", image: "https://www.photosforclass.com/download/px_699558"},
    {name: "mountain view", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name: "Salmon Creek", image: "https://www.photosforclass.com/download/px_699558"},
    {name: "mountain view", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name: "Salmon Creek", image: "https://www.photosforclass.com/download/px_699558"},
    {name: "mountain view", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
]

app.get("/campgrounds",function (req,res) {
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function (req,res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground); 

    //redirect back to campgrounds page
    //by default, goes to the get campground
    res.redirect("/campgrounds")
})

app.get("/campgrounds/new",function (req,res) {
    res.render("new");
})

app.listen("3000",function () {
    console.log("Server started at port 3000");
})
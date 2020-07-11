var     express     = require("express");
var     app         = express();
var     mongoose    = require("mongoose");
var     Campground  = require("./models/campgrounds");
var     seedDB      = require("./seeds");
const { render } = require("ejs");
var Comments = require("./models/comments");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp",{ useUnifiedTopology: true , useNewUrlParser: true }); // database connection 

bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine","ejs");

app.get("/",function (req,res) {
    res.render("landing");
})

//INDEX - Show all campgrounds
app.get("/campgrounds",function (req,res) {
    //get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds) {
        if(err)
        console.log("dikkat");
        else
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
    });
});

//CREATE - adds new camps to the DB
app.post("/campgrounds", function(req,res) {
    
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
app.get("/campgrounds/new",function (req,res) {
    res.render("campgrounds/new");
})

//SHOW ROUTE
app.get("/campgrounds/:id", function(req, res) {
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

app.get("/campgrounds/:id/comments/new",function(req,res) {
    Campground.findById(req.params.id,function(err,match) {
        if(err)
        console.log(err);
        else
        res.render("comments/new",{match: match});
    })
})

app.post("/campgrounds/:id/comments",function(req,res) {
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

app.listen("3000",function () {
    console.log("Server started at port 3000");
})
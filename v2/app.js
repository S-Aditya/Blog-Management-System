var     express     = require("express");
var     app         = express();
var     mongoose    = require("mongoose");
const { render } = require("ejs");

mongoose.connect("mongodb://localhost/yelp_camp",{ useUnifiedTopology: true , useNewUrlParser: true }); // database connection 

bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine","ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
    {
        name: "Sachin Tendulkar", 
        image: "https://i.pinimg.com/564x/15/3b/a8/153ba8ae7b4115f81cfa8b2296adafec.jpg",
        description: "Inspiration to many, a many so talented and eqully humble"
    },function (err,campground) {
    
        if(err)
        console.log("ERROR!");
        else{
            console.log("Succesfully Inserted!");
            console.log(campground);
        }
})

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
        res.render("index",{campgrounds:allCampgrounds});
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
    res.render("new");
})

app.get("/campgrounds/:id", function(req, res) {
    //find the campground with the required id
    //and show template with that campground
    Campground.findById(req.params.id, function(err,match) {
        if(err)
        console.log("Error in id route");
        else
        res.render("show",{match: match});
    })
})

app.listen("3000",function () {
    console.log("Server started at port 3000");
})
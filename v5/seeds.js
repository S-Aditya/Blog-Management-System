//var mongoose = require("mongoose");
var Campgrounds = require("./models/campgrounds");
var Comments    = require("./models/comments");

var data = [
    {
        name: "Spider man",
        image: "https://i.pinimg.com/236x/ba/4d/a8/ba4da891ae6b23b0ccb509903addbab3.jpg",
        description: "My favourite superhero, works form SHIELD"
    },
    {
        name: "Captain America",
        image: "https://i.pinimg.com/236x/e5/f9/70/e5f97050dc2ad9becac0b94aa1674d1e.jpg",
        description: "He leads the avengers"
    },
    {
        name: "Hulk",
        image: "https://i.pinimg.com/236x/18/88/3d/18883df69835a63061f8c6a66170de8a.jpg",
        description: "Very powerful!"
    }
]

function seedsDB()
{
    //Remove all campgrounds
    Campgrounds.remove({},function(err,camp) {
        if(err)
        console.log("delete karne me dikka!");
        else
        {
            console.log("Removed Campgrounds!");
            data.forEach(function(superHero) {
                Campgrounds.create(superHero,function(err,createdHero) {
                    if(err)
                    console.log("create karne me dikkat!");
                    else{
                        Comments.create({
                            text: "A marvel creation",
                            author: "Marvel Comics"
                        },function(err,commentHere) {
                            if(err)
                            console.log("comment banane me dikkat!");
                            else{
                                createdHero.comments.push(commentHere);
                                createdHero.save(function(err,data) {
                                    if(err)
                                    console.log("comment ko dubara save karne me dikkat!")
                                    else
                                    console.log(data);
                                })
                            }
                        })
                    }
                })
            })
        }
    })
}

module.exports = seedsDB;
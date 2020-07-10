const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Half-blood", image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/4e/fd/62/camp-korita.jpg"},
    {name: "Camp Jupiter", image: "https://cdn2.acsi.eu/5/c/1/9/5c191d53e5c0c.jpeg"},
    {name: "Hotel Valhalla", image: "https://travelspot24.com/wp-content/uploads/2019/05/Top-Luxurious-Hotels-in-the-World.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});


app.listen(3000, function(){
    console.log("Server started!");
});
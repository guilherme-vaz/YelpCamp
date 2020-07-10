const express = require("express")
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP - Isso é uma tabela no banco de dados, no caso no Mongodb, que é não relacional.
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//Isso é um modelo, criado  a partir dos dados que vão no Schema.
var Campground = mongoose.model("Campground", campgroundSchema);


//Aqui criei uma instância, usando a propriedade "create" do Mongoose e usando a variável "Campground" que guarda o modelo do Schema
/*
Campground.create(
    {
        name: "Fields of Asphodel", 
        image: "https://images2.alphacoders.com/702/thumb-1920-702872.jpg",
        description: "The Fields of Asphodel (also known as the Asphodel Meadows) is a section in the Underworld where indifferent or ordinary souls who lived a life of neither good or evil are sent to live after death"
    }, function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("NEWLY CREATED CAMPGROUND: ");
            console.log(campground);
        }
    });
*/


app.get("/", function(req, res){
    res.render("landing");
});


//INDEX - Show all campgrounds
app.get("/campgrounds", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allcampgrounds});
        }
    });
    
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req,res){
    //get data from form and add to campgrounds DB
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    //Create a new Campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
});

//NEW - Show form to create new campground
app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});


//SHOW - Shows more info about one campground 
app.get("/campgrounds/:id", function(req,res){
    //find campground with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    })
});

app.listen(3000, function(){
    console.log("Server started!");
});

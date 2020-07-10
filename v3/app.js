var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds")
 
//Configurações do mongoose
mongoose.connect("mongodb://localhost/yelp_camp_v3", {useNewUrlParser: true});
mongoose.set('useUnifiedTopology', true);

//Configurações do App
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();


//HOME - Home page
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("index",{campgrounds:allCampgrounds});
       }
    });
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID > Populate the section comments in the provided campground > execute the query
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
})


app.listen(3000, function(){
    console.log("Server started!");
});



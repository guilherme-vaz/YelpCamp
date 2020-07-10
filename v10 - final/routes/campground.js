var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //index.js é um nome especial de arquivo e não precisou ser chamado aqui não sentendi muito bem porque
const { text } = require("body-parser");

//INDEX - Show all campgrounds
router.get("/", function(req, res){
    if(req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi'); //Necessário para o search
        Campground.find({name: regex}, function(err, allCampgrounds){ //Quando o usuário digita um nome na barra de pesquisa essa linha do código diz que o nome do campground que deve ser pesquisado é o nome que o usuário passou na barra de pesquisa, daí o BD procura 
            if(err){
                console.log(err);
            } else {
               res.render("campgrounds/index",{campgrounds:allCampgrounds, page: "campgrounds"});
            }
         });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds, page: "campgrounds"});
        }
        });
    }
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add campgrounds to DB
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID > Populate the section comments in the provided campground > execute the query
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.id, function(err, foundCampground){ //encontra o ID do campground que vai ser editado
            if(err) {
                req.flash("error", "Sorry, something went wrong"); 
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
            
        });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updateCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id); 
        }
    });
    //redirect somewhere(show page)
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;
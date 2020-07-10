var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//Pega o id de um campground e vai para o arquivo ejs "new" que é um form para adcionar um comentário no post do campground
//A rota aqui é "comments/new" porque o arquivo "new" está dentro da pasta comments

//Comments new
router.get("/new", isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments create
router.post("/", isLoggedIn, function(req,res){
    //Encontra o campground usando o ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //Criando/colocando o comentário criado no campground
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //adicionando username e id no comentário
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //salvar comentário
                    comment.save();
                    //Associando o comentário com o campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log("comment");
                    //Volta para o campground agora atualizado
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect ("/login");
}

module.exports = router;


  

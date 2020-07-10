var express = require("express");
var router = express.Router({mergeParams: true}); //facilita a modularização do código
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Pega o id de um campground e vai para o arquivo ejs "new" que é um form para adcionar um comentário no post do campground
//A rota aqui é "comments/new" porque o arquivo "new" está dentro da pasta comments

//COMMENTS NEW - basicamente mostra o form pra um novo comentário
router.get("/new", middleware.isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//COMMENTS CREATE - basicamente se assegura que o comentário foi criado e postado no post certo
router.post("/", middleware.isLoggedIn, function(req,res){
    //Encontra o campground usando o ID
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //Criando/colocando o comentário criado no campground
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong, try again please"); 
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
                    req.flash("success", "Successfully added comment"); 
                    //Volta para o campground agora atualizado
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//COMMENTS EDIT ROUTE - Encontra o comentário através de seu ID para poder editá-lo
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        }); 
    });  
});

//COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted"); 
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;


  

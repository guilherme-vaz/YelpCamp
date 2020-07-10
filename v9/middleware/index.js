var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All middleware goes here
var middlewareObj = {};

//Middleware pra ver se o user é dono do campground que ele quer editar/excluir
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //verifica se o user está autenticado
        Campground.findById(req.params.id, function(err, foundCampground){ //encontra o ID do campground que vai ser editado
            if(err){
                res.redirect("back");
            } else {
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) { //verifica se o ID do user logado é o mesmo ID do user que criou o campground que vai ser editado
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

//Middleware pra saber se o user é o dono do comentário que quer editar/deletar
middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){ //verifica se o user está autenticado
            Comment.findById(req.params.comment_id, function(err, foundComment){ //encontra o ID do campground que vai ser editado
                if(err){
                    res.redirect("back");
                } else {
                    //does user own the comment?
                    //Aqui é usado o método "equals" ao invés de === porque o comment.author.id é um objeto do mongoose (e não uma string)
                    //o "req.user._id está guardado dentro de "res.locals.currentUser" na linha 44 de app.js"
                    if(foundComment.author.id.equals(req.user._id)) { //verifica se o ID do user logado é o mesmo ID do user que criou o comentário que vai ser editado
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            res.redirect("back");
        }
    }


//Middleware pra saber se o user está logado 
middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect ("/login");
}
    

module.exports = middlewareObj;
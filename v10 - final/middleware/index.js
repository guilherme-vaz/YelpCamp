var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All middleware goes here
var middlewareObj = {};

//Middleware pra ver se o user é dono do campground que ele quer editar/excluir
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //verifica se o user está autenticado
        Campground.findById(req.params.id, function(err, foundCampground){ //encontra o ID do campground que vai ser editado
            if(err){
                req.flash("error", "Campground not found"); 
                res.redirect("back");
            } else {

                 // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
                
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) { //verifica se o ID do user logado é o mesmo ID do user que criou o campground que vai ser editado
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that"); 
                    res.redirect("back");
                }
            }
        });
    } else {
        //Colocar essa flash message aqui é só uma prevenção, geralmente os usuários normais não vão chegar aqui,
        //pra ver os botões de editar e deletar é preciso já estar logado, ao chegar aqui e ver isso quer dizer que usuário NÃO está logado e VIU os botões de editar/deletar de um campground. 
        //Ou seja, ele acessou através de uma rota diferente, tipo um hack.
        req.flash("error", "You need to be logged in to do that"); 
        res.redirect("back");
    }
}

//Middleware pra saber se o user é o dono do comentário que quer editar/deletar
middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){ //verifica se o user está autenticado
            Comment.findById(req.params.comment_id, function(err, foundComment){ //encontra o ID do campground que vai ser editado
                if(err || !foundComment){
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    //does user own the comment?
                    //Aqui é usado o método "equals" ao invés de === porque o comment.author.id é um objeto do mongoose (e não uma string)
                    //o "req.user._id" está guardado dentro de "res.locals.currentUser" na linha 44 de app.js"
                    if(foundComment.author.id.equals(req.user._id)) { //verifica se o ID do user logado é o mesmo ID do user que criou o comentário que vai ser editado
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that"); 
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that"); 
            res.redirect("back");
        }
    }


//Middleware pra saber se o user está logado 
middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that"); //Flash message pra avisar que o usuário deve logar primeiro
        res.redirect ("/login");
}
    

module.exports = middlewareObj;
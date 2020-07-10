//Esse arquivo serve pra "popular" o DB, ele serve como teste automático, ou seja quando não temos NADA no DB ele vai servir pra criar os campgrounds e comentários de forma automática pra vermos 
//o desenvolvimento da aplicação sem precisar manulmente criar um campground e adcionar comentários nele.
//Caso o DB já esteja populado com campgrounds e comentários esse arquivo pode ser comentado/descartado já que não será mais necessário.

var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Fields of Asphodel", 
        image: "https://images2.alphacoders.com/702/thumb-1920-702872.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Camp Jupiter", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Camp Half-Blood", 
        image: "https://www.hintokrivercamp.com/wp-content/uploads/2019/11/02.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all campgrounds - Aqui foi deletado todos os campgrounds que eu tinha colocado no DB, o "deleteMany" é um método do mongoose, nos parâmetros tem {}, o seja não estou especificando nenhuma instância em especial, tô delentando todas.
   Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        //Remove all comments - Mesma coisa feita com os campgrounds
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");

             //add a few campgrounds
             //Aqui foram adcionados os campgrounds que tão no array de objetos "Data" ali em cima
            data.forEach(function(seed){ //"seed" é uma variável pra especificar os dados dentro de "Data", podia ser qualquer nome de variável.
                Campground.create(seed, function(err, campground){ //"create" é um método do mongoose, pra cada dado "seed" passado no método create é criado um campground
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        //Aqui são exemplos de comentários
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;
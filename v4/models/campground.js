const mongoose = require("mongoose");
mongoose.set('useUnifiedTopology', true);

// SCHEMA SETUP - Isso é uma tabela no banco de dados, no caso no Mongodb, que é não relacional.
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
    ]
});

//Isso é um modelo, criado  a partir dos dados que vão no Schema.
//var Campground = mongoose.model("Campground", campgroundSchema);

//Isso abaixo é a mesma coisa da linha comentada acima só que usando module.exports
module.exports = mongoose.model("Campground", campgroundSchema);




//Aqui criei uma instância, usando a propriedade "create" do Mongoose e usando a variável "Campground" que guardava o modelo do Schema
//Deixei esse exemplo aqui mas fiz isso no ínicio lá no arquivos app.js e após fazer esse módulo passei pra cá pra deixar de exemplo
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

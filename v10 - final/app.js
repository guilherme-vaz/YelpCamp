var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

//requiring routes
var commentRoutes        = require("./routes/comments"),
    campgroundRoutes     = require("./routes/campground"),
    indexRoutes          = require("./routes/index");
 
//Configurações do mongoose 
mongoose.connect("mongodb://localhost/yelp_camp_v3", {useNewUrlParser: true});
mongoose.set('useUnifiedTopology', true);

//Configurações do App
//require('dotenv').config()
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public" )); //__dirname sempre vai ser a pasta do arquivo css, é um modo mais conveninente de fazer com o node
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); --> Comentei pois não preciso mais, já populei o DB

app.locals.moment = require('moment');
//PASSPORT CONFIGURATION - Configurações necessárias para auntnticar e logar um usuário
app.use(require("express-session")({
    secret: "Nessa linha pode ser escrito qualuqer coisa aparentemente, não importa.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//Essa linha abaixo é necessária para o middleware da lógica de login lá em baixo
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Essas linhas abaixo precisam vir exatamente após o passport configuration
app.use(function(req, res, next){
    res.locals.currentUser = req.user; //Todas os templates vão ter o currentUser disponível para uso, assim evita um bug, obs.: se o user estiver logado
    res.locals.error = req.flash("error"); //Mesma coisa da linha acima
    res.locals.success = req.flash("success"); //Mesma coisa da primeira linha
    next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("Server started!");
});
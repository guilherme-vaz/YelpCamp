var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


require('dotenv').config()

//Root route
router.get("/", function(req,res){
    res.render("landing");
});

//Show register form - O formulário de cadastro de usuário
router.get("/register", function(req,res){
    res.render("register", {page: "register"});
});

//Handle sign up logic
router.post("/register", function(req,res){
    var newUser = new User(
        {
            username: req.body.username, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar 
        });
    //eval(require("locus")) //npm package que permite "parar" o código nesse ponto, era pra usar com a autorização de administrador, mas não vou implementar isso
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username); 
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", function(req, res){
    res.render("login"), {page: "login"};
});

//Handling login logic - app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
     }), function(req,res){
    
});

//logout route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!"); //Flash message pra avisar que o usuário foi deslogado
    res.redirect("/campgrounds");
});

//forgot password
router.get("/forgot", function(req,res){
    res.render("forgot");
});

router.post("/forgot", function(req,res,next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({email: req.body.email}, function(err, user){
                if(!user){
                    req.flash("error", "No account with that email address exists.");
                    return res.redirect("/forgot");
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; //Uma hora

                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: "doctarru@gmail.com",
                  pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: "halfbloodinfo@gmail.com",
                subject: "Half-Blood Camp password reset",
                text: 'You are receiving this because you (or someone else) have requested the reset of the password' + 
                    'Please click on the following link, or paste this into your browser to complete the process' + 
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did nmot request this, please ignore this email and your password will remain unchanged.'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log("mail sent");
                req.flash("success", "An e-mail has been sent to " + user.email);
                done(err, "done");
            });
        }
    ], function(err){
        if (err) return next(err);
        res.redirect("/forgot");
    }
    );
});

//USER PROFILE
router.get("/users/:id", function(req,res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/");
        }
        Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect("/");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
        });
    });
});

module.exports = router;
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});




const User = mongoose.model('User', userSchema);


/*
app.route("/")
    .get(function(req, res){
        res.send("OK.");
    })
*/

app.get('/', function(req, res){
    console.log('Yeap');
    res.render('home');
});

app.get('/login', function(req, res){
    console.log('Yeap');
    res.render('login');
});

app.get('/register', function(req, res){
    console.log('Yeap');
    res.render('register');
});

app.post('/register', function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser =  new User({
            email: req.body.username,
            password: hash
        });
        console.log(newUser);
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render('secrets');
            }
        });    
    });
})

app.post('/login', function(req, res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    
    User.findOne({email: userEmail}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser) {
                bcrypt.compare(userPassword , foundUser.password).then(function(result) {
                    if(result === true){
                        res.render("secrets");
                    }                                        
                });
            }
        }
        
    })
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
  
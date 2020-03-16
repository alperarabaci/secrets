//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = proc.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"]});

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
    const newUser =  new User({
        email: req.body.username,
        password: req.body.password
    });
    console.log(newUser);
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secrets');
        }
    });    
})

app.post('/login', function(req, res){
    const email = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: req.body.username, password: req.body.password}, function(err, foundUser){
        res.render('secrets');
    })
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
  
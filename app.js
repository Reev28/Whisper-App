//jshint esversion:6
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const port = 3000;

const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://admin-reev:fpkQno1WHHrjuuZ6@cluster0.0llqunt.mongodb.net/userDB');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
    res.render("Home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({ email: username }).exec();
    if (foundUser) {
        if (foundUser.password === password) {
            res.render("secrets");
        }
    }
});

app.get("/register", (req, res) => {
    res.render("register");

});

app.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    await newUser.save();
    res.render("secrets");
});



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
const express = require('express');
const mongoose = require("mongoose");
const routes = require('./routes/authroutes');
const Book = require("./models/Book");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();
const PORT = 3000;


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static('public'));
app.use('/auth', routes);
app.use("/books", require("./routes/books"));

mongoose.connect(process.env.dbURL)
        .then((result) => {
            console.log('Connected to MongoDB')

            app.listen(PORT, () => {
                console.log("Server Started on Port 3000");
            })
        })
        .catch((err) => {
            console.error('Could not connect to MongoDB', err);
        });
require('dotenv').config();

const express = require('express');
const {PORT} = process.env;
const bodyParser = require('body-parser');
const productController = require('./controllers/index');
const passport = require("passport");

const app = express();
app.use(passport.initialize());

app.use(bodyParser.json());

productController(app);

app.listen(PORT, ()=>{
    console.log("running on port: ",PORT);
})
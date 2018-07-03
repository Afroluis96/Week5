require('dotenv').config();

const express = require('express');
const {PORT} = process.env;
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const passport = require("passport");

const app = express();
app.use(passport.initialize());

app.use(bodyParser.json());

routes(app);

app.listen(PORT, ()=>{
    console.log("running on port: ",PORT);
})
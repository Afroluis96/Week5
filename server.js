require('dotenv').config();

const express = require('express');
const {PORT} = process.env;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.listen(PORT, ()=>{
    console.log("running on port: ",PORT);
})
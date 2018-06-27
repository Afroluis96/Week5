require('dotenv').config();

const express = require('express');
const {PORT} = process.env;
const bodyParser = require('body-parser');
const productController = require('./controllers/index');

const app = express();
app.use(bodyParser.json());

productController(app);

app.listen(PORT, ()=>{
    console.log("running on port: ",PORT);
})
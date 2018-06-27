const _ = require("lodash");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const dbK = require('../db/index.js');
const db = dbK();

const users = db.import('../models/users');

let allUsers;
users.findAll().then(res =>{
    allUsers = res;
});



module.exports = (app) =>{
        app.get('/', (req,res) =>{
           res.send(allUsers);

        })
}
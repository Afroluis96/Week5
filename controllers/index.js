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

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'applaudostudios';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  
users.findOne( {where:{id: jwt_payload.id}})
.then(user =>{
    if(!user) return Promise.reject({message:"User not found in strategy", statusCode:404});
    return user;
})
.then(user =>{
    if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
})
.catch((err)=>{
    res.status(err.statusCode || 500);
    res.send(err)
});
  
});


passport.use(strategy);

const loginProcess =  (req, res) => {

    if(req.body.name && req.body.password){
      var name = req.body.name;
      var password = req.body.password;
    }
    users.findOne({where:{userName:name}})
    .then(user => {
        if(!user) return Promise.reject({message:"User does not existss",statusCode:404});
        return user;
    }).then(user=>{
        if( !user ){
            res.status(401).send({message:"no such user found"});
          }
          if(user.userPassword === password) {
            var payload = {id: user.userId};
            var token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({message: "ok", token: token});
          } else {
            res.status(401).json({message:"passwords did not match"});
          }
    });
   
  }

module.exports = (app) =>{
        app.get('/', (req,res) =>{
           res.json({message: "Express is up"});

        });

        app.post("/login", loginProcess);
}
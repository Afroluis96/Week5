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
  var user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});


passport.use(strategy);


module.exports = (app) =>{
        app.get('/', (req,res) =>{
           res.json({message: "Express is up"});

        });

        app.post("/login", (req, res) => {
            if(req.body.name && req.body.password){
              var name = req.body.name;
              var password = req.body.password;
            }
            // usually this would be a database call:
            var user = users.findOne({whree:{userName:name}});
            if( !user ){
              res.status(401).send({message:"no such user found"});
            }
          
            if(user.userPassword === password) {
              // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
              var payload = {id: user.id};
              var token = jwt.sign(payload, jwtOptions.secretOrKey);
              res.json({message: "ok", token: token});
            } else {
              res.status(401).json({message:"passwords did not match"});
            }
          });
}
const _ = require("lodash");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const dbK = require('../db/index.js');
const db = dbK();

const users = db.import('../models/users');

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
jwtOptions.secretOrKey = 'applaudostudios';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  
users.findOne( {where:{userId: jwt_payload.id}})
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
    console.log("Error in strategy: ",err);
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
        if(!user) return Promise.reject({message:"User does not exists",statusCode:404});
        return user;
    }).then(user=>{
        if( !user ){
            res.status(401).send({message:"no such user found"});
          }
          if(user.userPassword === password) {
            var payload = {id: user.userId};
            var token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.send({message: "ok", token: token});
          } else {
            res.status(401).send({message:"passwords did not match"});
          }
    });
   
  }

module.exports = (app) =>{
        app.get('/', (req,res) =>{
           res.send({message: "Express is up"});

        });

        app.post("/login", loginProcess);

        app.get("/secret", passport.authenticate('jwt', { session: false }), (req, res)=>{
            res.send("Success! You can not see this without a token");
          });
}
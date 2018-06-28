const _ = require("lodash");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const helper = require('../helpers/user');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
jwtOptions.secretOrKey = 'applaudostudios';
jwtOptions.ignoreExpiration = false;
jwtOptions.jsonWebOptions = { expiresIn : 28800};



var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    helper.findUserById( jwt_payload.id)
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

let getToken = (userId) =>{

    var payload = {id: userId};
    var token = jwt.sign(payload, jwtOptions.secretOrKey, jwtOptions.jsonWebOptions);
    return token;
}

module.exports ={

    getToken

   
}
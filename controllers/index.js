const auth = require('../middlewares/login');
const passport = require('passport');
const helper = require('../helpers/index');

const loginProcess =  (req, res) => {

    if(req.body.name && req.body.password){
      var name = req.body.name;
      var password = req.body.password;
    }
   helper.findUserByName(name)
    .then(user =>{
        if( !user ){
            res.status(401).send({message:"no such user found"});
          }
          if(user.userPassword === password) {
           let token = auth.getToken(user.userId);
           console.log("token: ",token);
            res.send({message: "ok", token: token});
          } else {
            res.status(401).send({message:"passwords did not match"});
          }
    }).catch((err)=>{
        res.status(err.statusCode || 500);
        res.send(err)
    });

   
   
  }

module.exports = (app) =>{
        app.get('/', (req,res) =>{
           res.send({message: "Express is up"});

        });

        app.post("/login", loginProcess);

        app.get("/secret", passport.authenticate('jwt', { session: false }), (req, res)=>{
            console.log(req.user);
            res.send("Success! You can not see this without a token");
          });
}
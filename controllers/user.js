const userLib = require('../lib/user/index');
const auth = require('../middlewares/login');

const loginProcess =  (req, res) => {

    if(req.body.name && req.body.password){
      var name = req.body.name;
      var password = req.body.password;
      console.log(name);
    }
    userLib.findUserByName(name)
    .then(user =>{
        console.log(user);
        if( !user ){
            return res.status(401).send({message:"no such user found"});
          }
          if(user.userPassword === password) {
           let token = auth.getToken(user.userId);
           console.log("token: ",token);
            return res.send({message: "ok", token: token});
          } else {
            return res.status(401).send({message:"passwords did not match"});
          }
    }).catch((err)=>{
        return res.status(err.statusCode || 500).send(err);
        
    });
  }


  const insertUser = (req, res) =>{
    if(!req.body ){
        console.log('request body not found');
        return res.sendStatus(400);
    }
    const userName = req.body.name;
    const pass = req.body.password;
    console.log(userName)
    userLib.addUser(userName,pass)
    .then(user =>{  
        if(!user) return res.status(400).send({message:"Could not add the user"});
        res.send(user);
    }).catch((err)=>{
        res.status(err.statusCode || 500);
        res.send(err)
    } ); 
}

const addAdmin = (req, res) =>{
    if(!req.user){
        console.log('Not authorize at user');
        return res.sendStatus(401);
    }
    if(req.user.isAdmin !== 1){
        console.log('Not authorize at isadmin');
        return res.sendStatus(403);
    }
    const id = (req.params.id !== undefined) ? req.params.id : null;
    if(!id) return res.status(404).send({message:"No user"});
    if(!isNaN(id)){
        userLib.updateUser(id)
        .then(user =>{  
            if(!user) return res.status(400).send({message:"Could not add the user"});
            res.sendStatus(200);
        }).catch((err)=>{
            res.status(err.statusCode || 500);
            res.send(err)
        } ); 
    }else{
        return res.status(400).send({message:"Id must be a number"});
    }
    
}

  module.exports = {
    loginProcess,
    insertUser,
    addAdmin
  }
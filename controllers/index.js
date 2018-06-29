const auth = require('../middlewares/login');
const passport = require('passport');
const userHelper = require('../helpers/user');
const productHelper = require('../helpers/products');

const loginProcess =  (req, res) => {

    if(req.body.name && req.body.password){
      var name = req.body.name;
      var password = req.body.password;
    }
    userHelper.findUserByName(name)
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

  const addProduct = (req, res) =>{
    if(!req.body ){
        console.log('request body not found');
        return res.sendStatus(400);
    }
    if(!req.user){
        console.log('Not authorize');
        return res.sendStatus(401);
    }
    if(req.user.isAdmin !== 1){
        console.log('Not authorize');
        return res.sendStatus(403);
    }
    const price = req.body.price;
    const stock = req.body.stock;
    const name = req.body.name;
    if (!isNaN(price) && !isNaN(stock)){
        if(price > 0 && stock > 0){

            productHelper.addNewProduct(name, price,stock)
            .then(product =>{
                res.send({message:"Producto added", product})
            }).catch((err)=>{
                res.status(err.statusCode || 500);
                res.send(err)
            });

        }else{
            res.status(400).send({message:'Data not well formated'});
        }
        
    } else{

    }



}

deleteProduct = (req,res) =>{
    const id = req.params.id;
    productHelper.findProductById(id)
    .then(product =>{
        return productHelper.deleteProduct(id);
    })
    .then( response => {
        res.sendStatus(200);
    }).catch((err)=>{
        res.status(err.statusCode || 500);
        res.send(err)
    });

}

let modifyProduct = (req,res) =>{
    if(!req.body ){
        console.log('request body not found');
        return res.sendStatus(400);
    }
    const price = req.body.price;
    if(!isNaN(price)){
        
        const id = req.params.id;
        productHelper.findProductById(id)
        .then( product => {
            if(!product) return res.status(400).send({message:"Product not found"});
            return productHelper.updateProduct(price,id);
           
        })
        .then((updated)=>{
            if(!updated) return res.status(400).send({message:"Product not updated"});
            return productHelper.findProductById(id)
            
        }).then(productUpdated =>{
            res.send(productUpdated);
        })
        .catch((err)=>{
            res.status(err.statusCode || 500);
            res.send(err)
        });
    }
    else{
        res.status(400).send({message:"Price is not a number"});
    }

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

        app.post("/products",passport.authenticate('jwt', { session: false }),addProduct);

        app.delete("/products/:id",passport.authenticate('jwt', { session: false }),deleteProduct );

        app.patch('/products/:id',passport.authenticate('jwt', { session: false }),modifyProduct);
}
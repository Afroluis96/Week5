const auth = require('../middlewares/login');
const passport = require('passport');
const userHelper = require('../helpers/user');
const productHelper = require('../helpers/products');
const likeHelper = require('../helpers/likes');

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
    if(!req.user){
        console.log('Not authorize');
        return res.sendStatus(401);
    }
    if(req.user.isAdmin !== 1){
        console.log('Not authorize');
        return res.sendStatus(403);
    }
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
    if(!req.user){
        console.log('Not authorize');
        return res.sendStatus(401);
    }
    if(req.user.isAdmin !== 1){
        console.log('Not authorize');
        return res.sendStatus(403);
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
            res.send({id:productUpdated.productId, name:productUpdated.productName, price:productUpdated.price, stock:productUpdated.stock});
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

let buyProduct = (req,res) =>{
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
    const quantity = req.body.quantity;
    const user = req.user.userId;
    const id = req.params.id;
    let instProduct;
    if (!isNaN(quantity) && quantity > 0){
        
            productHelper.findProductById(id)
            .then(product =>{
                if(!product) return res.status(400).send({message:"Product not found"});
                if(quantity > product.stock) return res.status(422).send({message:"Quantity can not be more than product Stock"});
                instProduct = product;
                let total = product.price * quantity;

                return  productHelper.buyProduct(quantity,user,product.productId, total);
            })
            .then(log =>{
                if(!log) return res.status(400).send({message:"Could not add the purchase"});
                 
                return [productHelper.reduceStockProduct(quantity,instProduct.stock, instProduct.productId ),log]
            })
            .then(([updated,log]) =>{
                console.log("plog2 : ", log);
                if(!updated) return res.status(400).send({message:"Could not reduce stock in the product"});
                res.send({lodId:log.logId,productId:log.productId, userId:log.userId, quantity:log.quantity, total:log.total});
            }).catch((err)=>{
                res.status(err.statusCode || 500);
                res.send(err)
            });
    }  else{
        res.status(400).send({message:'Data not well formated'});

    }
}

let likeProduct = (req,res) =>{
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
    
    const user = req.user.userId;
    const id = req.params.id;
    let instProduct;
    productHelper.findProductById(id)
    .then(product =>{
        if(!product) return res.status(400).send({message:"Product not found"});
        instProduct = product;
        
        return  likeHelper.findLike(product.productId,user);
    })
    .then(like =>{
        if(!like){
            console.log("No existia");
            return likeHelper.like(instProduct.productId, user);
        } else{
            console.log("existia");
            return likeHelper.dislike(instProduct.productId,user);
        }
    })
    .then( response =>{
        if(!response) return res.status(400).send({message:"Action missed"});
        return likeHelper.likeCounter(instProduct.productId);
        
    })
    .then(result =>{
        if(!result) return res.status(400).send({message:"Action missed"});
        return productHelper.addLike(instProduct.productId, result);
    })
    .then(liked =>{
        if(!liked) return res.status(400).send({message:"Action missed"});
        res.send({id:instProduct.productId,name:instProduct.productName, price:instProduct.price, likes: instProduct.like, stock:instProduct.stock});
    })
    .catch((err)=>{
        res.status(err.statusCode || 500);
        res.send(err)
    });
   
}

let individualProduct = (req,res) =>{
    const id = req.params.id;
    productHelper.findProductById(id)
    .then(product =>{
        if(!product) return res.status(400).send({message:"Producto not found"});
        res.send(product);
    })
}

let getAllProducts = (req, res) =>{
    let limit = (req.query.limit !== undefined) ? Number(req.query.limit) : 0;        
    let page = (req.query.page !== undefined) ? Number(req.query.page) : 1;   
    let offset = (page-1) * limit;
    productHelper.findAllProducts(limit,offset)  
    .then(data =>{
        let pages = Math.ceil(data.count / limit);
		offset = limit * (page - 1);
        let product = data.rows;
        res.status(200).send({'result': product, 'count': data.count, 'pages': pages});
    })   

}
module.exports = (app) =>{
        app.get('/', (req,res) =>{
           res.send({message: "Express is up"});

        });

        app.post("/login", loginProcess);

        app.post("/products",passport.authenticate('jwt', { session: false }),addProduct);

        app.delete("/products/:id",passport.authenticate('jwt', { session: false }),deleteProduct );

        app.patch('/products/:id',passport.authenticate('jwt', { session: false }),modifyProduct);

        app.post('/products/:id/buy',passport.authenticate('jwt', { session: false }),buyProduct);

        app.post('/products/:id/like',passport.authenticate('jwt', { session: false }),likeProduct);

        app.get('/products/:id',individualProduct);

        app.get('/products', getAllProducts);
}
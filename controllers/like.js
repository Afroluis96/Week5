const likeLib = require('../lib/like/index');
const productLib = require('../lib/product/index');

const likeProduct = (req,res) =>{
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
    productLib.findProductById(id)
    .then(product =>{
        if(!product) return res.status(400).send({message:"Product not found"});
        instProduct = product;
        
        return  likeLib.findLike(product.productId,user);
    })
    .then(like =>{
        if(!like){
            console.log("No existia");
            return likeLib.like(instProduct.productId, user);
        } else{
            console.log("existia");
            return likeLib.dislike(instProduct.productId,user);
        }
    })
    .then( response =>{
        if(!response) return res.status(400).send({message:"Action missed"});
        return likeLib.likeCounter(instProduct.productId);
        
    })
    .then(result =>{
        if(!result) return res.status(400).send({message:"Action missed"});
        return productLib.addLike(instProduct.productId, result);
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

module.exports = {
    likeProduct
}
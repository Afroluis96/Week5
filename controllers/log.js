const productLib = require('../lib/product/index');
const logLib = require('../lib/log/index');

const buyProduct = (req,res) =>{
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
        
            productLib.findProductById(id)
            .then(product =>{
                if(!product) return res.status(400).send({message:"Product not found"});
                if(quantity > product.stock) return res.status(422).send({message:"Quantity can not be more than product Stock"});
                instProduct = product;
                let total = product.price * quantity;

                return  logLib.buyProduct(quantity,user,product.productId, total);
            })
            .then(log =>{
                if(!log) return res.status(400).send({message:"Could not add the purchase"});
                 
                return [productLib.reduceStockProduct(quantity,instProduct.stock, instProduct.productId ),log]
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

module.exports = {
    buyProduct
}
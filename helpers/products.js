
const dbK = require('../db/index.js');
const db = dbK();
let products = db.import('../models/products');
let log = db.import('../models/log');
let likes = db.import('../models/likes');


let addNewProduct = (productName, price, stock) => {
    return products.build({
        productName,
        price,
        stock,
        enable: 1
    }).save()
    .then(product=>{
        return product;
    })
    
}

let deleteProduct = (productId) => {
    return products.destroy({
        where :{
            productId
        }
    })
    .then(affectedRows=>{
        return true;
    })
    
}

let updateProduct = (price,productId) => {
  
    return products.update(
        {price},
        {where:{productId}}
    )
}
let reduceStockProduct = (quantity,stock,productId) => {
    console.log("entering in reduce stock");
    let newStock = stock - quantity;
    return products.update(
        {stock: newStock},
        {where:{productId}}
    )
}

let findProductById = (productId) => {
    return products.findOne({where : {
        productId,
        enable:1
    }}).then(product => {
        if(!product) return Promise.reject({message:"Product does not exists",statusCode:404});
        return product;
    });
}

let buyProduct = (quantity,userId,productId,total) => {

    return log.build({
        productId,
        userId,
        quantity,
        total
    }).save()
    .then(product=>{
        return product;
    })
    
}

let findLike = (productId, userId) =>{
    return likes.findOne({where :{productId,userId}})
    .then(like =>{
        return like;
    });
}

let like = (productId, userId) =>{
    return likes.build({
        userId,
        productId
    }).save()
    .then(like =>{
        return like;
    });
}

let dislike = (productId, userId) =>{
    return likes.destroy({
        where:{
            userId,
        productId
        }
    })
    .then(like =>{
        return true;
    });
}


module.exports = {
    addNewProduct,
    deleteProduct,
    findProductById,
    updateProduct,
    buyProduct,
    reduceStockProduct,
    findLike,
    like,
    dislike
}
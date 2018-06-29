
const dbK = require('../db/index.js');
const db = dbK();
let products = db.import('../models/products');


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

let findProductById = (productId) => {
    return products.findOne({where : {
        productId
    }}).then(product => {
        if(!product) return Promise.reject({message:"Product does not exists",statusCode:404});
        return product;
    });
}

module.exports = {
    addNewProduct,
    deleteProduct,
    findProductById
}
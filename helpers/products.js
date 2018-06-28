
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

module.exports = {
    addNewProduct
}

const dbK = require('../../db/index.js');
const db = dbK();
let products = db.import('../../models/products');
let log = db.import('../../models/log');



const addNewProduct = (productName, price, stock) => {
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

const deleteProduct = (productId) => {
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
const reduceStockProduct = (quantity,stock,productId) => {
    console.log("entering in reduce stock");
    let newStock = stock - quantity;
    return products.update(
        {stock: newStock},
        {where:{productId}}
    )
}

const findProductById = (productId) => {
    return products.findOne({where : {
        productId,
        enable:1
    }}).then(product => {
        if(!product) return Promise.reject({message:"Product does not exists",statusCode:404});
        return product;
    });
}

const findProductByName = (productName) => {
    return products.findOne({where : {
        productName,
        enable:1
    }}).then(product => {
        if(!product) return Promise.reject({message:"Product does not exists",statusCode:404});
        return product;
    });
}

const addLike = (productId,counter) =>{
    return products.update(
        {likes:counter},
        {where:{productId}}
    )
}

const findAllProducts = (limit,offset,sort,sortable) =>{
   
        return products.findAndCountAll({
            order : [
            [sort,sortable]
            ],
            limit,
            offset
        }).then((data) =>{
            return data;
        });
}

module.exports = {
    addNewProduct,
    deleteProduct,
    findProductById,
    updateProduct,
    reduceStockProduct,
    addLike,
    findAllProducts,
    findProductByName
}
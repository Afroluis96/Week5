const dbK = require('../../db/index.js');
const db = dbK();

let log = db.import('../../models/log');


const buyProduct = (quantity,userId,productId,total) => {

    return log.build({
        productId,
        userId,
        quantity,
        total
    }).save()
    
    
}

module.exports = {
    buyProduct
}
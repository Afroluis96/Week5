
const dbK = require('../db/index.js');
const db = dbK();
let likes = db.import('../models/likes');

let findLike = (productId, userId) =>{
    return likes.findOne({where :{productId,userId}})
    .then(like =>{
        return like;
    });
}

let likeCounter = (productId) =>{
    return likes.findAndCountAll({
        where:{
            productId
        }
    }).then(result =>{
        console.log("counter: ",result.count)
        return result.count;
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

module.exports={
    findLike,
    likeCounter,
    like,
    dislike
}
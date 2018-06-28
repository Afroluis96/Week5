
const dbK = require('../db/index.js');
const db = dbK();
let users = db.import('../models/users');

let findUserByName = (name) => {

    return users.findOne({where:{userName:name}})  
    .then(user => {
        if(!user) return Promise.reject({message:"User does not exists",statusCode:404});
        
        return user;
    })
}

let findUserById = (id) => {

    return users.findOne({where:{userId:id}})  
    .then(user => {
        if(!user) return Promise.reject({message:"User does not exists",statusCode:404});
        
        return user;
    })
}


module.exports = {
    findUserByName,
    findUserById
}
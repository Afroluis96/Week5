
const dbK = require('../../db/index.js');
const db = dbK();
const users = db.import('../../models/users');

const findUserByName = (name) => {

    return users.findOne({where:{userName:name}})  
    .then(user => {
        if(!user) return Promise.reject({message:"User does not exists",statusCode:404});
        
        return user;
    })
}

const findUserById = (id) => {

    return users.findOne({where:{userId:id}})  
    .then(user => {
        if(!user) return Promise.reject({message:"User does not exists",statusCode:404});
        
        return user;
    })
}

const addUser = (userName,userPassword) =>{
    return users.build({
        userName,
        userPassword,
        isAdmin:0
    }
        
    ).save()
}

const updateUser = (userId) =>{
    return users.update(
        {isAdmin:1},
        {where:{userId}}
    )
}


module.exports = {
    findUserByName,
    findUserById,
    addUser,
    updateUser
}
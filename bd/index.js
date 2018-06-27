require('dotenv').config('../.env');
const Sequelize = require('sequelize');

const {DB_NAME,DB_HOST,DB_USER,DB_PASSWORD,DB_PORT} = process.env;


module.exports =() =>{
    const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: 'mysql',
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
    });

    

    return db; 

}
const passport = require('passport');
const userHelper = require('../lib/user/index');
const productController = require('../controllers/product');
const userController = require('../controllers/user');
const logController = require('../controllers/log');
const likeController = require('../controllers/like');

module.exports = (app) =>{
  
        app.post("/login", userController.loginProcess);

        app.post("/products",passport.authenticate('jwt', { session: false }),productController.addProduct);

        app.delete("/products/:id",passport.authenticate('jwt', { session: false }),productController.deleteProduct );

        app.patch('/products/:id',passport.authenticate('jwt', { session: false }),productController.modifyProduct);

        app.post('/products/:id/buy',passport.authenticate('jwt', { session: false }),logController.buyProduct);

        app.post('/products/:id/like',passport.authenticate('jwt', { session: false }),likeController.likeProduct);

        app.get('/products/:parameter',productController.individualProduct);

        app.get('/products', productController.getAllProducts);
        
        app.post('/users', userController.insertUser);

        app.get('/users/:id/admin', passport.authenticate('jwt', { session: false }),userController.addAdmin);
}
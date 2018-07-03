const productLib = require('../lib/product/index');


const addProduct = (req, res) =>{
    if(!req.body ){
        console.log('request body not found');
        return res.sendStatus(400);
    }
    if(!req.user){
        console.log('Not authorize');
        return res.sendStatus(401);
    }
    if(req.user.isAdmin !== 1){
        console.log('Not authorize');
        return res.sendStatus(403);
    }
    const price = req.body.price;
    const stock = req.body.stock;
    const name = req.body.name;
    if (!isNaN(price) && !isNaN(stock)){
        if(price > 0 && stock > 0){

            productLib.addNewProduct(name, price,stock)
            .then(product =>{
                res.send({message:"Producto added", product})
            }).catch((err)=>{
                res.status(err.statusCode || 500);
                res.send(err)
            });

        }else{
            res.status(400).send({message:'Data not well formated'});
        }
        
    } else{

    }
}

const deleteProduct = (req,res) =>{
    if(!req.user){
        console.log('Not authorize');
        return res.sendStatus(401);
    }
    if(req.user.isAdmin !== 1){
        console.log('Not authorize');
        return res.sendStatus(403);
    }
    const id = req.params.id;
    productLib.findProductById(id)
    .then(product =>{
        return productLib.deleteProduct(id);
    })
    .then( response => {
        res.sendStatus(200);
    }).catch((err)=>{
        res.status(err.statusCode || 500);
        res.send(err)
    });

}

const modifyProduct = (req,res) =>{
    if(!req.body ){
        console.log('request body not found');
        return res.sendStatus(400);
    }
    if(!req.user){
        console.log('Not authorize');
        return res.sendStatus(401);
    }
    if(req.user.isAdmin !== 1){
        console.log('Not authorize');
        return res.sendStatus(403);
    }
    const price = req.body.price;
    if(!isNaN(price)){
        
        const id = req.params.id;
        productLib.findProductById(id)
        .then( product => {
            if(!product) return res.status(400).send({message:"Product not found"});
            return productLib.updateProduct(price,id);
           
        })
        .then((updated)=>{
            if(!updated) return res.status(400).send({message:"Product not updated"});
            return productLib.findProductById(id)
            
        }).then(productUpdated =>{
            res.send({id:productUpdated.productId, name:productUpdated.productName, price:productUpdated.price, stock:productUpdated.stock});
        })
        .catch((err)=>{
            res.status(err.statusCode || 500);
            res.send(err)
        });
    }
    else{
        res.status(400).send({message:"Price is not a number"});
    }

}

const individualProduct = (req,res) =>{
    const parameter = req.params.parameter;
    if (!isNaN(parameter)){
        productLib.findProductById(parameter)
        .then(product =>{
            if(!product) return res.status(400).send({message:"Product not found"});
            res.send(product);
        }).catch((err)=>{
            res.status(err.statusCode || 500);
            res.send(err)
        });
    }else{
        productLib.findProductByName(parameter)
        .then(product =>{
            if(!product) return res.status(400).send({message:"Product not found"});
            res.send(product);
        }).catch((err)=>{
            res.status(err.statusCode || 500);
            res.send(err)
        });
    }
    
}


const getAllProducts = (req, res) =>{

    let limit = (req.query.limit !== undefined) ? Number(req.query.limit) : 5;        
    let page = (req.query.page !== undefined) ? Number(req.query.page) : 1;   
    let sort = (req.query.sort !== undefined) ? req.query.sort : 'name';
    let sortable = 'ASC';
    if(sort === 'name' || sort === 'popularity') { 
        sort = (sort === 'name') ? 'productName':'likes';
    }
    else if(sort === '-name' || sort === '-popularity') {
        sortable = 'DESC';
        sort = sort.substring(1);
        sort = (sort === 'name') ? 'productName':'likes';
    }
    
    let offset = (page-1) * limit;
    productLib.findAllProducts(limit,offset,sort,sortable)  
    .then(data =>{
        let pages = Math.ceil(data.count / limit);
		offset = limit * (page - 1);
        let product = data.rows;
        res.status(200).send({'result': product, 'count': data.count, 'pages': pages});
    }).catch((err)=>{
        res.status(err.statusCode || 500);
        res.send(err)
    } ); 

}

module.exports = {
    addProduct,
    deleteProduct,
    modifyProduct,
    individualProduct,
    getAllProducts
}

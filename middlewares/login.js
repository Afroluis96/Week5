module.exports = (app) =>{
    app.post('user/login', (req,res) =>{
        let user = req.body.idUser;
        let pass = req.body.password;
    })
}
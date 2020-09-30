const jwt = require('jsonwebtoken')

const validaToken = (req,res,next) => {
    let token = req.get('token');

    jwt.verify(token,process.env.SEED,(err,data) => {
        if(err) res.status(401).json({success: false,message: err});
        req.usuario = data.usuario;
         next();
    });
}

const validaAdmin = (req,res,next) => {
    if(req.usuario.role == 'ADMIN_ROLE') next();
    else res.status(401).json({success: false,message: 'Accion no permitida.'});
}

module.exports = { validaToken, validaAdmin };
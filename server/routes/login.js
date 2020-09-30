const express = require('express')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario')

const app = express()

app.post('/login',(req,res) => {
    let data = req.body;
    Usuario.findOne({email: data.email},'email password nombre estado google role',(err, usuarioDB) => {
        if(err) return res.status(500).json({status:'error',message: err});
        if(!usuarioDB) return res.status(400).json({status:'error',message: 'El usuario no existe'});
        
        if(!bcrypt.compareSync(data.password,usuarioDB.password)) return res.status(400).json({success: false, message: 'La clave es incorrecta.'});

        res.json({
            success: true,
            usuario: usuarioDB,
            token: jwt.sign({
                usuario: {
                    email: usuarioDB.email,
                    nombre: usuarioDB.nombre,
                    estado: usuarioDB.estado,
                    role: usuarioDB.role,
                    google: usuarioDB.google,
                    _id: usuarioDB._id
                }
            },process.env.SEED,{expiresIn: process.env.EXPIRED_TOKEN })
        });
    });

});
//funcion para obtener datos del TOKEN Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //console.log(payload.name);
    //console.log(payload.email);
    //console.log(payload.picture);
    //const userid = payload['sub'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    }
  }

app.post('/google',async (req,res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({success: false, message: err});
    });
    
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        if(usuarioDB){
            //logea el usuario
            if(usuarioDB.google === false){
                return res.status(400).json({success: false,  message: 'Debe usar autenticacion manual.'});
            }else{            
                return res.json({
                    success: true,
                    message: 'Ingreso exitoso!',
                    usuario: usuarioDB,
                    token: jwt.sign({
                        usuario: usuarioDB
                    },process.env.SEED,{expiresIn: process.env.EXPIRED_TOKEN })
                });
            }
        }
        
        //crea el usuario
        let user = new Usuario();
        user.nombre = googleUser.nombre;
        user.email = googleUser.email;
        user.img = googleUser.img;
        user.password = ':)';
        user.google = true;

        user.save((err, usuarioDB) => {
            if(err) return res.status(500).json({success: false, message: err});

            return res.json({
                success: true,
                message: 'Usuario creado!',
                usuario: usuarioDB,
                token: jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED,{expiresIn: process.env.EXPIRED_TOKEN })
            });

        });

    });
});

module.exports = app;
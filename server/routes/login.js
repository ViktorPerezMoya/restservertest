const express = require('express')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const app = express()

app.post('/login',(req,res) => {
    let data = req.body;
    Usuario.findOne({email: data.email},'email password nombre estado google role',(err, usuarioDB) => {
        if(err) return res.status(500).json({status:'error',message: err});
        if(!usuarioDB) return res.status(400).json({status:'error',message: 'El usuario no existe'});
        
        if(!bcrypt.compareSync(data.password,usuarioDB.password)) return res.status(400).json({status: 'error',message: 'La clave es incorrecta.'});

        res.json({
            status: 'ok',
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
            },'seed-de-desarrollo',{expiresIn: 60*60*24*30 })
        });
    });

})


module.exports = app;
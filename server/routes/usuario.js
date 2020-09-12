const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const app = express()
const Usuario = require('../models/usuario')
const { validaToken, validaAdmin } = require('../midlewares/authentication');

let usuarios = [
    {codigo: 1,nombre: 'Victor Perez'},
    {codigo: 2,nombre: 'Romina Martinez'},
];

app.get('/', (req, res) => {
    res.send('Demo API Rest')
})

app.get('/usuarios', validaToken, (req,res) => {
    
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Usuario.find({estado: true},'nombre email estado google role').skip(desde).limit(limite).exec((err,usuarios) => {
        if(err) return res.status(400).json({status: 'error',message: err});

        Usuario.count({estado: true},(err, count) => {
            if(err) return res.status(400).json({status: 'error',message: err});

            return res.json({
                status: 'ok',
                usuarios,
                total_rows: count,
                desde,
                limite
            });
        })
    });

})

app.post('/usuario', [ validaToken, validaAdmin ], (req,res)=>{
    let data = req.body;

    let usuario = new Usuario({
        nombre: data.nombre,
        email: data.email,
        password: bcrypt.hashSync(data.password,10),
        role: data.role,
    });

    usuario.save((err,usuarioBD)=>{
        if(err) return res.status(400).json({estatus:'error',message: err});
        
        return res.json({status:'ok',usuario: usuarioBD});
    });
})

app.put('/usuario/:id', [ validaToken, validaAdmin ], (req,res) => {
    let id = req.params.id;
    let data = _.pick(req.body,['nombre','email','img','estado','role']);

    Usuario.findByIdAndUpdate(id,data,{new: true, runValidators: true,context: 'query'},(err, usuarioBD) =>{
        if(err) return res.status(400).json({status:'error',message: err});

        return res.json({status:'ok',usuario: usuarioBD});
    });
})

app.delete('/usuario/:id', [ validaToken, validaAdmin ], (req,res) =>{
    let id = req.params.id;
    Usuario.findByIdAndDelete(id,(err , usuarioDelete) => {
        if(err) return res.status(400).json({status:'error',message: err});

        if(!usuarioDelete) res.status(400).json({status: 'error',message: 'El usuario no se encuentra en base de datos'});

        return res.json({status: 'ok', message: 'El registro fue elimninado de la BD.'});
    });
})

app.delete('/estado/:id', validaToken, (req,res) => {
    let id =  req.params.id;
    Usuario.findByIdAndUpdate(id,{estado: false},{new: true},(err,usuarioBD) => {
        if(err) return res.status(400).json({status:'error',message: err});
        if(!usuarioBD) return res.status(400).json({status:'error',message: 'El usuario no se encuentra en base de datos.'});
        return res.json({status: 'ok', usuario: usuarioBD});
    });  
})

module.exports = app;
const express = require('express');
const Categoria = require('../models/categoria');
const {validaToken,validaAdmin} = require('../midlewares/authentication');

const app = express();


// =================================
// Trae todas las categorias
// =================================
app.get('/categorias',async (req,res) => {
    let categorias = await Categoria.find({}).populate('usuario','nombre email').sort('descripcion');
    return res.json({success: true,categorias});
});

// =================================
// Trae una categoria
// =================================
app.get('/categoria/:id',(req,res) => {
    Categoria.findById(req.params.id,(err,categoriaDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        if(categoriaDB)
            return res.json({success: true, categoria: categoriaDB});
        return res.status(400).json({success: false, message: 'No existe la categoria'});
    });
});

// =================================
// Crea una categoria
// =================================
app.post('/categoria',[ validaToken, validaAdmin],(req,res) => {
    let categoria = new Categoria();
    categoria.descripcion = req.body.descripcion;
    categoria.usuario = req.usuario._id;

    categoria.save((err, categoriaDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        res.json({success: true, categoria: categoriaDB});
    });
});

// =================================
// Actualiza una categoria
// =================================
app.put('/categoria', [ validaToken, validaAdmin],(req,res) => {

    Categoria.findById(req.body.id,(err, categoriaDB1) => {
        if(err) return res.status(500).json({success: false, message: err});
        if(categoriaDB1){
            categoriaDB1.descripcion = req.body.descripcion;
            categoriaDB1.save((err, categoriaDB2) => {
                if(err) return res.status(500).json({success: false, message: err});
                res.json({success: true, categoria: categoriaDB2});
            });
        }else{
            return res.status(400).json({success: false, message: 'No existe la categoria'});
        }
    });
});

// =================================
// elimina una categoria
// =================================
app.delete('/categoria/:id',[ validaToken, validaAdmin], async (req,res) => {
    Categoria.findById(req.params.id,(err,categoriaDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        if(categoriaDB){}
        else{
            return res.status(400).json({success: false, message: 'No se encontro la categoria a eliminar.'});
        }
    });

    let result =  await Categoria.deleteOne({_id: req.params.id},(err) => {
        if(err) return res.status(500).json({success: false, message: err});
    });
    res.json({success: true, message: 'Categoria eliminada con exito.'});
});

module.exports = app;
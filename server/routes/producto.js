const express = require('express');
const {validaToken,validaAdmin} = require('../midlewares/authentication');
const Producto = require('../models/producto');

const app = express();

// =================================
// Trae todas los productos
// =================================
app.get('/productos/:pagina?',validaToken,async (req,res) => {
    let pagina = req.params.pagina || 0;
    
    let productosList = await Producto.find({disponible: true})
        .populate('usuario', 'nombre email')
        .populate('categoria','descripcion')
        .limit(5)
        .skip(pagina * 5);
    return res.json({success: true, productos: productosList});
});

// =================================
// Busqueda de productos
// =================================
app.get('/productos/busqueda/:termino',validaToken,async (req,res) => {
    
    let regexp = new RegExp(req.params.termino,'i');
    let productosList = await Producto.find({disponible: true, nombre: regexp})
        .populate('usuario', 'nombre email')
        .populate('categoria','descripcion');

    return res.json({success: true, productos: productosList});
});

// =================================
// Trae uno de los productos
// =================================
app.get('/producto/:id',validaToken,(req,res) => {
    Producto.findById(req.params.id, (err,productoDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        if(!productoDB) return res.status(400).json({success: false, message: 'Producto no encontrado.'});
        
        Producto.populate(productoDB,[{path: 'categoria', select: 'descripcion'},{path:'usuario', select: 'nombre email'}],(err, productoDB) => {
            if(err) return res.status(500).json({success: false, message: err});
            return res.json({success: true, producto: productoDB});
        });
        
    });
});

// =================================
// Crea un producto
// =================================
app.post('/producto', [validaToken, validaAdmin], (req,res) => {
    let producto = new Producto();    
    producto.nombre = req.body.nombre;
    producto.precioUni = req.body.preciounitario;
    producto.descripcion = req.body.descripcion || '';
    producto.categoria = req.body.idcategoria;
    producto.usuario = req.usuario._id;

    producto.save((err, productoDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        res.json({success: true, producto: productoDB});
    });
});

// =================================
// Actualiza un producto
// =================================
app.put('/producto/:id', [validaToken, validaAdmin],(req,res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id,{
        nombre: req.body.nombre,
        precioUni: req.body.preciounitario,
        descripcion: req.body.descripcion || '',
        categoria: req.body.idcategoria,
        usuario: req.usuario._id
    },{new: true},
    (err,productoDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        res.json({success: true, producto: productoDB});
    });
});

// =================================
// Elimina un producto
// =================================
app.delete('/producto/:id', [validaToken, validaAdmin],(req,res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id,{
        disponible: false
    },{new: true},
    (err,productoDB) => {
        if(err) return res.status(500).json({success: false, message: err});
        res.json({success: true, producto: productoDB});
    });
    
})

module.exports = app;
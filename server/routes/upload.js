const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const path = require('path');
const fs = require('fs');

const app = express();

app.use(fileUpload({useTempFiles: true}));

app.put('/upload/:tipo/:id', function(req, res) {
  
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({success: false,message: 'No hay archivo seleccionado'});
  }

  //valido tipo
  let tipos = ['productos','usuarios'];
  if(tipos.indexOf(tipo) < 0){
    return res.status(400).json({success: false,message: 'El tipo/categoria de la imagen no es correcta, las categorias son ('+tipos.join()+').'});
  }

  //valido extension
  let miArchivo = req.files.miArchivo;
  let extensiones = ['png','jpg','gif','jpeg'];
  let vNombre = miArchivo.name.split(".");
  if(vNombre.length == 1) return res.status(400).json({success: false,message: 'No hay extension para el archivo seleccionado'});
  let extension = vNombre[vNombre.length-1];
  console.log(extension);
  if(extensiones.indexOf(extension) < 0) 
      return res.status(400).json({success: false,message: 'La extension del archivo no es correcta.',extension});

  //cambiar_nombre a imagen
  let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

  //subir imagen
  miArchivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
    if (err)
      return res.status(500).json({success: false,err});

      switch (tipo){
        case 'usuarios': imagenUsuario(id,res,nombreArchivo); break;
        case 'productos': imagenProducto(id,res,nombreArchivo); break;
      }
      
  });
});

function imagenUsuario(id,res,nombreArchivo){
  Usuario.findById(id,(err, usuarioDB) => {
    if(err) {
      borrarImagen(nombreArchivo,'usuarios');
      return res.status(500).json({success: false,err});
    }

    if(!usuarioDB){
      borrarImagen(nombreArchivo,'usuarios');
      return res.status(400).json({success: false,message : 'No existe el usuario.'});
    }

    borrarImagen(usuarioDB.img,'usuarios');

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioDB) => {
      if(err){
        borrarImagen(nombreArchivo,'usuarios');
        return res.status(500).json({success: false,err});
      }
      
      res.json({success: true,usaurio: usuarioDB});
    });
  });
}

function imagenProducto(id,res,nombreArchivo){

  Producto.findById(id,(err, productoDB) => {
    if(err){
      borrarImagen(nombreArchivo,'productos');
      return res.status(500).json({success: false,err});
    }

    if(!productoDB){
      borrarImagen(nombreArchivo,'productos');
      return res.status(400).json({success: false,message: 'El producto no existe'});
    }

    if(productoDB.img) borrarImagen(productoDB.img,'productos');

    productoDB.img = nombreArchivo;
    productoDB.save((err,productoDB) => {
      if(err){
        borrarImagen(nombreArchivo,'productos');
        return res.status(500).json({success: false,err});
      }

      res.json({status: true, producto: productoDB});
    });
    
  });

}

function borrarImagen(nombreArchivo,tipo){
  let pathArchivo = path.resolve(__dirname,`../../uploads/${tipo}/${nombreArchivo}`);
  if(fs.existsSync(pathArchivo)){
    fs.unlinkSync(pathArchivo);
  }
}

module.exports = app;
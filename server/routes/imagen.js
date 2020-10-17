const express = require('express');
const fs = require('fs');
const path = require('path');

const { validaTokenImg } = require('../midlewares/authentication');

const app = express();

app.get('/imagen/:tipo/:img',validaTokenImg,(req,res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    let pathNoImage = path.resolve(__dirname,`../assets/no-image.jpg`);

    if(fs.existsSync(pathImage)){
        return res.sendFile(pathImage);   
    }
    return res.sendFile(pathNoImage);
    
});

module.exports = app;

const express = require('express')
const bodyparser = require('body-parser')
require('./config/config')

const app = express()
const port = process.env.PORT

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.get('/', (req, res) => {
  res.send('Demo API Rest')
})

let usuarios = [
    {codigo: 1,nombre: 'Victor Perez'},
    {codigo: 2,nombre: 'Romina Martines'},
];

app.get('/usuarios',(req,res) => {
    res.json({
        usuarios
    });
})

app.get('/usuario/:codigo',(req,res) =>{
    if(req.params.codigo === undefined) res.status('400').json({
        status: 'failed',
        message: 'No hay codigo de usuario a buscar'
    });
    let usuario = usuarios.find(item => item.codigo == req.params.codigo);
    if(!usuario) res.status('400').json({
        status: 'failed',
        message: 'El usuario no existe'
    });

    res.json({usuario})
})

app.post('/usuario',(req,res)=>{
    let data = req.body;
    let error = "";
    if(data.nombre === undefined || data.codigo === undefined  ) error = 'Faltan datos en el formulario';
    let index = usuarios.findIndex(item => item.codigo == data.codigo);
    if(index >= 0) error = 'El usuario ya existe';

    if(error.length > 0) res.status('400').json({status: 'failed',message: error});
    else{
        usuarios.push({
            codigo: data.codigo,
            nombre: data.nombre,
        });

        res.json({status:'ok',message: 'Usuario cargado exitosamente!'});
    }
})

app.put('/usuario',(req,res) => {
    let index = usuarios.findIndex(item => item.codigo === req.body.codigo);
    if(index < 0 )res.status('400').json({status: 'failed',message: 'No se encontro el usuario a modificar.'});
    else{
        usuarios[index].nombre = req.body.nombre;
        res.json({status: 'ok',message: 'Usuario actualizado!'});
    }
})

app.delete('/usuario',(req,res) =>{
    res.json('Delete Usuario.')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
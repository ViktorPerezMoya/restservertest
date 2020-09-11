const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
require('./config/config')

const app = express()
const port = process.env.PORT

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URL_DB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err) => {
    if(err) throw err;
    console.log('Conectado a la base dedatos en el puerto 27017');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
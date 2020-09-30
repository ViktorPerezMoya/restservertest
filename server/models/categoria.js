const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion:{
        type: String,
        unique: true,
        required: [true,'Descripcion es requerido']
    },
    usuario: {
        type: 'ObjectId',
        ref: 'Usuario'
    }
});

categoriaSchema.set('toJSON',{useProjection : true});

categoriaSchema.plugin(uniqueValidator,{message: '{PATH} ya existe'});

module.exports = mongoose.model('Categoria', categoriaSchema);
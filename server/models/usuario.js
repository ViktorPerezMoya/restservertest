const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true,'Nombre es requerido']
    },
    email:{
        type: String,
        unique: true,
        required: [true,'Email es requerido']
    },
    password:{
        type: String,
        select: false,
        required: [true,'Password es requerido']
    },
    img: {
        type: String,
        required: false
    },
    role:{
        type: String,
        enum: {
            values: ['USER_ROLE','ADMIN_ROLE'],
            message: '{VALUE} no es valido'
        },
        default: 'USER_ROLE'
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

usuarioSchema.set('toJSON',{useProjection : true});

usuarioSchema.plugin(uniqueValidator,{message: '{PATH} ya existe'});

module.exports = mongoose.model('Usuario', usuarioSchema);
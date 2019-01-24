
// Requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userRoles = {
     values: ['ADMIN_ROLE', 'USER_ROLE'],
     message: '{VALUE} no es un rol válido'
}

var usuarioSchema = new Schema( {

     userName: { type: String, required: [true, 'El nombre de usuario es obligatorio'] },
     userMail: { type: String, unique:true, required: [true, 'El correo de usuario es obligatorio'] },
     userPsswrd: { type: String, required: [true, 'La contraseña es obligatoria']  },
     img: { type: String, required: false, default: null },
     role: { type: String, required: true, default: 'USER_ROLE', enum: userRoles },
     google: { type: Boolean, required: false, default: false }

} );

usuarioSchema.plugin( uniqueValidator, {
     message: "el {PATH} debe ser único"
} )

module.exports = mongoose.model('Usuario', usuarioSchema)
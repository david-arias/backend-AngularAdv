
// Requires
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// conexión a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/adminDB', ( err , res ) => {
     if ( err ) throw err;

     console.log('Base de datos: \x1b[32m%s\x1b[0m','ONLINE');
})

// rutas
app.get('/', ( req, res, next ) => {

     res.status(200).json({
          ok: true,
          mssg: "Petición realizada correctamente"
     })

} )


// escuchar peticiones
app.listen(3002, () => {
     console.log('Express server puerto 3002: \x1b[32m%s\x1b[0m','ONLINE');
})
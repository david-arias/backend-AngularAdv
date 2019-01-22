
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

// inicializar variables
var app = express();

// body parser
// = = = = =  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// = = = = =   parse application/json
app.use(bodyParser.json())


// importaciones | rutas
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')

// conexión a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/adminDB', ( err , res ) => {
     if ( err ) throw err;

     console.log('Base de datos: \x1b[32m%s\x1b[0m','ONLINE');
})

// rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


// escuchar peticiones
app.listen(3002, () => {
     console.log('Express server puerto 3002: \x1b[32m%s\x1b[0m','ONLINE');
})
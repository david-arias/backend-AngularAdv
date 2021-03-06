
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


// inicializar variables
var app = express();

// enable CORS
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
     next();
});

// body parser
// = = = = =  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// = = = = =   parse application/json
app.use(bodyParser.json())


// importaciones | rutas
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')

var companyRoutes = require('./routes/company')
var movieRoutes = require('./routes/movie')

var searchRoutes = require('./routes/search')

var uploadRoutes = require('./routes/upload')
var imgRoutes = require('./routes/img')

// conexión a base de datos
mongoose.connection.openUri('mongodb://localhost:27017/adminDB', ( err , res ) => {
     if ( err ) throw err;

     console.log('Base de datos: \x1b[32m%s\x1b[0m','ONLINE');
})

// rutas
app.use('/img', imgRoutes);
app.use('/upload', uploadRoutes);

app.use('/search', searchRoutes);

app.use('/movie', movieRoutes);
app.use('/company', companyRoutes);

app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);

app.use('/', appRoutes);


// escuchar peticiones
app.listen(3002, () => {
     console.log('Express server puerto 3002: \x1b[32m%s\x1b[0m','ONLINE');
})
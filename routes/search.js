
// Requires
var express = require('express');

// inicializar variables
var app = express();

// modules
var Company = require('../models/company');
var Movie = require('../models/movie');
var Usuario = require('../models/usuario');

// ================================================
// GET - SEARCH all companies
// ================================================
app.get('/all/:query', ( req, res, next ) => {

     var search = req.params.query;
     var regex = new RegExp( search, 'i');

     Promise.all( [
          searchCompanies(search,regex),
          searchMovies(search,regex),
          searchUsers(search,regex),
     ] ).then( resp => {
          res.status(200).json({
               ok: true,
               companies: resp[0],
               movies: resp[1],
               users: resp[2],
          })
     })

} )

// ================================================
// GET - SEARCH in categorie
// ================================================
app.get('/category/:table/:query', ( req, res, next ) => {

     var table = req.params.table;
     var search = req.params.query;
     var regexSearch = new RegExp( search, 'i');

     var prom;

     switch ( table ) {
          case 'users':
               prom = searchUsers( search, regexSearch);
               break;
          case 'companies':
               prom = searchCompanies( search, regexSearch);
               break;
          case 'movies':
               prom = searchMovies( search, regexSearch);
               break;
          default:
               return res.status(400).json({
                    ok: true,
                    mssg: 'los tipos de busqueda solo son: users - companies - movies',
                    error: {
                         mssg: 'tipo de tabla/colección no válido'
                    }
               })
     }

     prom.then ( data => {
          res.status(200).json({
               ok: true,
               [table]: data
          })
     })

} )

function searchCompanies( search, regex ) {

     return new Promise ( ( resolve, reject ) => {

          Company.find( {compName: regex })
               .populate('user', 'userName userMail')
               .exec(( err, companies ) => {
                    if ( err ) {
                         reject('Error carga Productoras', err);
                    } else {
                         resolve( companies );
                    }
               })

     })
}
function searchMovies( search, regex ) {

     return new Promise ( ( resolve, reject ) => {

          Movie.find( {movieName: regex })
               .populate('user', 'userName userMail')
               .populate('company', 'compName compLogoImg')
               .exec(( err, movies ) => {
          
                    if ( err ) {
                         reject('Error carga peliculas', err);
                    } else {
                         resolve( movies );
                    }
               })

     })
}
function searchUsers( search, regex ) {

     return new Promise ( ( resolve, reject ) => {

          Usuario.find({}, 'userName userMail img role')
               .or( [ { 'userName': regex },{ 'userMail': regex } ] )
               .exec( (err, users) => {
                    if ( err ) {
                         reject('Error carga usuarios', err);
                    } else {
                         resolve( users );
                    }
               })

     })
}






module.exports = app;
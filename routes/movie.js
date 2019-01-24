
// Requires
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

// inicializar variables
var app = express();

// modelos
var Movie = require('../models/movie');

// ================================================
// GET all companies
// ================================================
app.get('/', ( req, res, next ) => {

     var from = req.query.from || 0;
     from = Number(from);

     Movie.find({})
          .skip(from)
          .limit(5)
          .populate('user', 'userName userMail')
          .populate('company')
          .exec(

               (err, movies) => {
          
                    if ( err ) {
                         return res.status(500).json({
                              ok: false,
                              mssg: "Error en base de datos | carga de peliculas",
                              errors: err
                         })
                    }

                    Movie.count({}, (err, count) => {
                         if ( err ) {
                              return res.status(500).json({
                                   ok: false,
                                   mssg: "Error en base de datos | conteo de peliculas",
                                   errors: err
                              })
                         }
               
                         res.status(200).json({
                              ok: true,
                              totalMovies: count,
                              mssg: "peliculas cargados",
                              companies: movies,
                         })
                    })
               }
          )
} )

// ================================================
// POST new company
// ================================================
app.post('/', mdAutenticacion.verifyToken, ( req, res ) => {

     var body = req.body;

     var movie = new Movie({
          movieName: body.movieName,
          company: body.company,
          user: req.user._id
     });

     movie.save( ( err, saveMovie ) => {
          if ( err ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | Creación de usuario",
                    errors: err
               })
          }
          
          res.status(201).json({
               ok: true,
               user: saveMovie,
               adminUser: req.user
          })
     } )

});

// ================================================
// PUT update movie
// ================================================
app.put('/:id', mdAutenticacion.verifyToken, ( req, res ) => {

     var id = req.params.id;
     var body = req.body;

     Movie.findById( id, ( err, movie ) => {

          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error en base de datos | error al buscar pelicula",
                    errors: err
               })
          }
          if ( !movie ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | pelicula no existe",
                    errors: { message: 'No existe una pelicula con el ID: ' + id }
               })
          }

          movie.movieName = body.movieName,
          movie.company = body.company,
          movie.user = req.user._id

          movie.save( (err, movieSaved ) => {

               if ( err ) {
                    return res.status(400).json({
                         ok: false,
                         mssg: "Error en base de datos | No es posible actualizar productora",
                         errors: err
                    })
               }
               res.status(200).json({
                    ok: true,
                    user: movieSaved
               });

          } );

     });
})

// ================================================
// DELETE delete by id user
// ================================================
app.delete('/:id', mdAutenticacion.verifyToken, ( req, res ) => {
     var id = req.params.id;

     Movie.findByIdAndRemove( id, ( err, movieDeleted ) => {

          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error en base de datos | No es posible borrar pelicula",
                    errors: err
               })
          }
          if ( !movieDeleted ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | No existe pelicula",
                    errors: { message: 'no existe pelicula con ese ID' }
               })
          }

          res.status(200).json({
               ok: true,
               user: movieDeleted
          });

     })
})






// ================================================

module.exports = app;
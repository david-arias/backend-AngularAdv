
// Requires
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

// inicializar variables
var app = express();

// modelos
var Movie = require('../models/movie');

// ================================================
// GET all movi
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
                              movies: movies,
                         })
                    })
               }
          )
} )
// ================================================
// GET movie by ID
// ================================================
app.get('/:id', ( req, res ) => {
     var id = req.params.id;

     Movie.findById( id )
     .populate('user', 'userName userMail')
     .populate('company')
     .exec( (err, movie) => {
          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error en base de datos | carga de Pelicula por ID",
                    errors: err
               })
          }
          if ( !movie ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | No existe Pelicula con ese ID",
                    errors: err
               })
          }

          res.status(200).json({
               ok: true,
               movie: movie,
          })
     })
})

// ================================================
// POST new movie
// ================================================
app.post('/', [mdAutenticacion.verifyToken, mdAutenticacion.verifyAdmin], ( req, res ) => {

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
                    mssg: "Error en base de datos | Creación de pelicula",
                    errors: err
               })
          }
          
          res.status(201).json({
               ok: true,
               movie: saveMovie,
               adminUser: req.user
          })
     } )

});

// ================================================
// PUT update movie
// ================================================
app.put('/:id', [mdAutenticacion.verifyToken, mdAutenticacion.verifyAdmin], ( req, res ) => {

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
          movie.movieRating = body.movieRating,
          movie.movieYear = body.movieYear,
          movie.movieOverview = body.movieOverview,
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
app.delete('/:id', [mdAutenticacion.verifyToken, mdAutenticacion.verifyAdmin], ( req, res ) => {
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

// Requires
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

// inicializar variables
var app = express();

// modelos
var Company = require('../models/company');

// ================================================
// GET all companies
// ================================================
app.get('/', ( req, res, next ) => {

     var from = req.query.from || 0;
     from = Number(from);

     Company.find({})
          .skip(from)
          .limit(5)
          .populate('user', 'userName userMail')
          .exec(
               (err, comps) => {
          
                    if ( err ) {
                         return res.status(500).json({
                              ok: false,
                              mssg: "Error en base de datos | carga de productoras",
                              errors: err
                         })
                    }
                    
                    Company.count({}, (err, count) => {
                         if ( err ) {
                              return res.status(500).json({
                                   ok: false,
                                   mssg: "Error en base de datos | conteo de productoras",
                                   errors: err
                              })
                         }

                         res.status(200).json({
                              ok: true,
                              totalCompanies: count,
                              mssg: "productoras cargados",
                              companies: comps,
                         })
                    });
          
               }
          )
} )

// ================================================
// POST new company
// ================================================
app.post('/', mdAutenticacion.verifyToken, ( req, res ) => {

     var body = req.body;

     var comp = new Company({
          compName: body.compName,
          user: req.user._id
     });

     comp.save( ( err, saveComp ) => {
          if ( err ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | Creación de usuario",
                    errors: err
               })
          }
          
          res.status(201).json({
               ok: true,
               user: saveComp,
               adminUser: req.user
          })
     } )

});

// ================================================
// PUT update company
// ================================================
app.put('/:id', mdAutenticacion.verifyToken, ( req, res ) => {

     var id = req.params.id;
     var body = req.body;

     Company.findById( id, ( err, comp ) => {

          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error en base de datos | error al buscar productora",
                    errors: err
               })
          }
          if ( !comp ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | productora no existe",
                    errors: { message: 'No existe un usuario con el ID: ' + id }
               })
          }

          comp.compName = body.compName;
          comp.user = req.user._id;

          comp.save( (err, compSaved ) => {

               if ( err ) {
                    return res.status(400).json({
                         ok: false,
                         mssg: "Error en base de datos | No es posible actualizar productora",
                         errors: err
                    })
               }
               res.status(200).json({
                    ok: true,
                    user: compSaved
               });

          } );

     });
})

// ================================================
// DELETE delete by id user
// ================================================
app.delete('/:id', mdAutenticacion.verifyToken, ( req, res ) => {
     var id = req.params.id;

     Company.findByIdAndRemove( id, ( err, compDeleted ) => {

          if ( err ) {
               return res.status(500).json({
                    ok: false,
                    mssg: "Error en base de datos | No es posible borrar productora",
                    errors: err
               })
          }
          if ( !compDeleted ) {
               return res.status(400).json({
                    ok: false,
                    mssg: "Error en base de datos | No existe productora",
                    errors: { message: 'no existe productora con ese ID' }
               })
          }

          res.status(200).json({
               ok: true,
               user: compDeleted
          });

     })
})







// ================================================

module.exports = app;

// Requires
var express = require('express');

// inicializar variables
var app = express();

const PATH = require('path');
const fs = require('fs');

// ================================================
// GET 
// ================================================
app.get('/:kind/:img', ( req, res, next ) => {

     var kind = req.params.kind;
     var img = req.params.img;

     // valid collection types
     var validKinds = ['companies', 'movieBacks', 'moviePoster', 'users'];
     if ( validKinds.indexOf( kind ) < 0 ) {
          return res.status(400).json({
               ok: false,
               mssg: "Tipo de collección no valida",
               errors: { mssg: 'Las colecciones validas son: ' + validKinds.join(', ') }
          })
     }

     // Image 
     var imgPath = PATH.resolve( __dirname, `../uploads/${kind}/${img}` );

     if ( fs.existsSync(imgPath) ) {
          res.sendFile( imgPath );
     } else {
          var noImgPath;
          switch ( kind ) {
               case 'users':
                    var noImgPath = PATH.resolve( __dirname, `../assets/userAvatar_default.jpg` );
                    break;
               case 'companies':
                    var noImgPath = PATH.resolve( __dirname, `../assets/companieLogo_default.jpg` );
                    break;
               case 'movieBacks':
                    var noImgPath = PATH.resolve( __dirname, `../assets/movieBack_default.jpg` );
                    break;
               case 'moviePoster':
                    var noImgPath = PATH.resolve( __dirname, `../assets/moviePoster_default.jpg` );
                    break;
               default:
                    return res.status(400).json({
                         ok: false,
                         mssg: "Tipo de collección no valida",
                         errors: { mssg: 'Las colecciones validas son: ' + validKinds.join(', ') }
                    })
          }
          res.sendFile( noImgPath );
     }

} )

module.exports = app;
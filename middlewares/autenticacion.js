// Requires
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ================================================
// Verify Token
// ================================================
exports.verifyToken = function ( req,res,next ) {

     var token = req.query.token;
     
     jwt.verify( token, SEED, ( err, decoded ) => {
          if ( err ) {
               return res.status(401).json({
                    ok: false,
                    mssg: "Error verificación de token",
                    errors: err
               })
          }

          req.user = decoded.user;
     
          next();
          // return res.status(200).json({
          //      ok: false,
          //      decoded: decoded
          // })
     })
} 

// ================================================
// Verify ADMIN
// ================================================
exports.verifyAdmin = function ( req,res,next ) {

     var user = req.user;

     if ( user.role === 'ADMIN_ROLE' ) {
          next();
          return;
     } else {
          return res.status(401).json({
               ok: false,
               mssg: "Error de token",
          })
     }
} 

// ================================================
// Verify ADMIN o mismo usuario
// ================================================
exports.verifyAdminOrUser = function ( req,res,next ) {

     var user = req.user;
     var id = req.params.id;

     if ( user.role === 'ADMIN_ROLE' || user._id === id ) {
          next();
          return;
     } else {
          return res.status(401).json({
               ok: false,
               mssg: "Error de token",
          })
     }
} 

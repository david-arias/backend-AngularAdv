
// Requires
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moviesSchema = new Schema({
     movieName: { type: String, required: [true, 'El nombre de la pelicula es obligatorio'] },
     moviePoster: { type: String, required: false, default: null },
     movieBackdrop: { type: String, required: false, default: null },
     movieYear: { type: String, required: false, default: '0000' },
     movieRating: { type: Number, required: false, default: 0 },
     movieOverview: { type: String, required: false, default: 'lorem ipsum dolor sit' },
     user: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
     company: { type: Schema.Types.ObjectId, ref: 'Company', required: true},
}, { collection: 'movies'})

module.exports = mongoose.model('Movie', moviesSchema)
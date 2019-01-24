
// Requires
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
     compName: { type: String, required: [true, 'El nombre de productora es obligatorio'] },
     compLogoImg: { type: String, required: false, default: null },
     user: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true}
}, { collection: 'companies'})

module.exports = mongoose.model('Company', companySchema)
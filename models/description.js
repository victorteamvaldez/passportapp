var mongoose = require("mongoose");
var moment = require("moment");

var Schema = mongoose.Schema;

var DescriptionSchema = new Schema({
    description: {type: String, required: true},
    date: {type: Date, default: Date.now(), required: true},
    solicitud: {type: Schema.Types.ObjectId, ref: 'Solicitud', required: true}
})

module.exports = mongoose.model('DescriptionModel', DescriptionSchema);
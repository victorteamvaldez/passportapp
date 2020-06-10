var mongoose = require("mongoose");
var moment = require("moment");

var Schema = mongoose.Schema;

var ReasonSchema = new Schema({
    name: {type: String, required: true}
});

module.exports = mongoose.model('Reason', ReasonSchema);
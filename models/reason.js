var mongoose = require("mongoose");
var moment = require("moment");

var Schema = mongoose.Schema;

var ReasonSchema = new Schema({
    name: {type: String, required: true}
});

ReasonSchema
    .virtual('url')
    .get(function(){
        return '/reason/'+this._id;
    })

module.exports = mongoose.model('Reason', ReasonSchema);
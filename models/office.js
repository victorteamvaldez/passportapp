var mongoose = require("mongoose");
var moment = require("moment");

var Schema = mongoose.Schema;

var OfficeSchema = new Schema({
    name: {type: String, required: true}
});

OfficeSchema.
    virtual('url').
    get(
        function(){
            return '/office/'+this._id;
        }
    )

module.exports = mongoose.model('Office', OfficeSchema);
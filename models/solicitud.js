var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var SolicitudSchema = new Schema({
    name: String,
    last_name: String,
    application_date: {type: Date, default: Date.now()},
    cedula: String,
    birth_date: {type: Date},
    place_birth: String,
    telephone: String,
    address: String,
    city: String,
    state: String,
    zip_code: Number,
    last_passport: String,
    passport_book: String,
    last_passport_date: {type: Date},
    //Booleans to check forms
    picture_rovided: Boolean,
    cedula_provided: Boolean,
    birth_certificate_provided: Boolean,
    last_passport_provided: Boolean,
    request_type: String,
    status: String,
    description: String,
    office: {type: Schema.Types.ObjectId, ref: 'Office', required: true},
    reason: {type: Schema.Types.ObjectId, ref: 'Reason', required: true},
    
    
});

SolicitudSchema.
    virtual('full_name')
    .get(function(){
        var fullname = '';
        if (this.name && this.last_name){
            fullname = this.name +' '+ this.last_name;
        }
        if (!this.name || !this.last_name){
            fullname = '';
        }

        return fullname;
    })

SolicitudSchema.
    virtual('cute_date').
    get(function (){
        return moment(this.fecha).format('MMMM Do YYYY')
        }
    )

SolicitudSchema.
    virtual('url').
    get(
        function(){
            return '/catalog/'+ this._id;
        }
    )

module.exports = mongoose.model('Request', SolicitudSchema);

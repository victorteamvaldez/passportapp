var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var SolicitudSchema = new Schema({
    nombre: String,
    apellido: String,
    fecha: {type: Date, default: Date.now()},
    ciudad: String,
    solicitud: Number,
    fecha_nac: Date,
    ciudad_nac: String,
    pasaporte: String,
});

SolicitudSchema.
    virtual('nombre_completo')
    .get(function(){
        var fullname = '';
        if (this.nombre && this.apellido){
            fullname = this.nombre +' '+ this.apellido;
        }
        if (!this.nombre || !this.apellido){
            fullname = '';
        }

        return fullname;
    })

SolicitudSchema.
    virtual('fecha_cute').
    get(function (){
        return moment(this.fecha).format('MMMM Do YYYY, h:mm:ss a')
        }
    )

SolicitudSchema.
    virtual('url').
    get(
        function(){
            return '/catalog/'+ this._id;
        }
    )

module.exports = mongoose.model('SolicitudModel', SolicitudSchema);

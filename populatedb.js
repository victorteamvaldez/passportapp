#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Solicitud = require('./models/solicitud')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var solicitudes = []

function solicitudCreate(nombre, apellido, fecha, ciudad, solicitud_num, fecha_nac, ciudad_nac, pasaporte, cb) {
  //authordetail = {first_name:first_name , family_name: family_name }
  detalle = {nombre: nombre, apellido: apellido, ciudad:ciudad, solicitud:solicitud_num, ciudad_nac:ciudad_nac, pasaporte: pasaporte}
  //if (d_birth != false) authordetail.date_of_birth = d_birth
  //if (d_death != false) authordetail.date_of_death = d_death
  if (fecha != false) detalle.fecha = fecha
  if (fecha_nac != false) detalle.fecha_nac =fecha_nac

  var solicitud = new Solicitud(detalle);
       
  solicitud.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + solicitud);
    solicitudes.push(solicitud)
    cb(null, solicitud)
  }  );
}



function createSolicitudes(cb) {
    async.series([
        function(callback) {
          solicitudCreate('Lucas', 'Romano', '2020-04-19','New York', 546, '1973-06-05','La Vega', 'RD58654', callback);
        }],
        // optional callback
        cb);
}



async.series([
    createSolicitudes,

],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Done');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});





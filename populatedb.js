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

function solicitudCreate(name, last_name, application_date, birth_date, cb) {
  //authordetail = {first_name:first_name , family_name: family_name }
  detalle = {name: name, last_name: last_name, application_date:application_date, birth_date:birth_date}
  //if (d_birth != false) authordetail.date_of_birth = d_birth
  //if (d_death != false) authordetail.date_of_death = d_death
  if (application_date != false) detalle.application_date = application_date
  if (birth_date != false) detalle.birth_date = birth_date

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
          solicitudCreate('Enamnuel', 'Rocio', '2020-05-11','1990-05-02', callback);
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





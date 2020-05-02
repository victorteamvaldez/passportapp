var Solicitud = require('../models/solicitud');
const validator = require('express-validator');

var async = require('async');

exports.index = function(req, res){

    // Solicitud.countDocuments({}, (err, results)=>{
    //     res.render('index',{title: 'Consulado', error: err, data: results});
    // });
    async.parallel({
        solicitud_count: function(callback){
            Solicitud.countDocuments({}, callback)},
        }, function(err, results){
            res.render('index',{title: 'Consulado', error: err, data: results});
        });
};

exports.peticion_list = function(req, res, next){
    Solicitud.find({}).exec(function(err, solicitud_list){
        if(err) { return next(error); }
        res.render('catalog_list', {title:'Lista de Peticiones', list_solicitud: solicitud_list})
    });
};

exports.peticion_detail = function(req, res){
    async.parallel({
        solicitud: function(callback){Solicitud.findById(req.params.id).exec(callback)}
    }, function(err, results){
        if(err){ return next(err);}
        res.render('catalog_detail', {title: results.solicitud.nombre_completo, solic: results.solicitud});
    }
    );
};

exports.peticion_create_get = function(req, res){
    res.render('catalog_create',{title: 'Create Petition'});
}

exports.peticion_create_post =[
    validator.body('nombre','Nombre is required').trim().isLength({min: 1}),
    validator.body('apellido','Apellido is required').trim().isLength({min: 1}),
    validator.body('ciudad','Ciudad is required').trim().isLength({min: 1}),
    validator.body('solicitud','Colicitud is required').trim().isLength({min: 1}),
    validator.body('ciudad_nac','Ciudad de Nac is required').trim().isLength({min: 1}),
    validator.body('pasaporte','Pasaporte is required').trim().isLength({min: 1}),
    validator.body('fecha_nac', 'Fecha Nac is Required'),
    validator.sanitizeBody('nombre').escape(),
    validator.sanitizeBody('apellido').escape(),
    validator.sanitizeBody('ciudad').escape(),
    validator.sanitizeBody('solicitud').escape(),
    validator.sanitizeBody('ciudad_nac').escape(),
    validator.sanitizeBody('pasaporte').escape(),
    validator.sanitizeBody('fecha_nac').toDate(),

    (req, res, next)=>{
        const errors = validator.validationResult(req);

        var sol = new Solicitud(
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                ciudad: req.body.ciudad,
                solicitud: req.body.solicitud,
                ciudad_nac: req.body.ciudad_nac,
                pasaporte: req.body.pasaporte,
                fecha_nac: req.body.fecha_nac 
            }
        );

        if(!errors.isEmpty()){
            res.render('catalog_create', {title: 'Create Solicitud', solicitud: sol, errors: errors.array()});
            return;
        }
        else {
            Solicitud.findOne({'nombre': req.body.nombre})
                .exec(function(err, found_solicitud){
                    if(err) {return next(err);}

                    if(found_solicitud){
                        res.redirect(found_solicitud.url);
                    }else {
                        sol.save(function(err){
                            if(err) {return next(err);}

                            res.redirect(sol.url)
                        });
                    }
                });
        }
    },
];

exports.peticion_delete_get = function(req, res){
    res.send('Borrar peticion get');
}

exports.peticion_delete_post = function(req, res){
    res.send('Borrar peticion post');
}

exports.peticion_update_get = function(req, res){
    res.send('Update with a form get');
}

exports.peticion_update_post = function(req, res){
    res.send('Update post')
}
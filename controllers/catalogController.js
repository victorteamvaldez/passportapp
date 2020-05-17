var Solicitud = require('../models/solicitud');
var Office = require('../models/office');
var Reason = require('../models/reason');
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
    async.parallel({
        offices: function(callback){
            Office.find(callback);
        },
        reasons: function(callback){
            Reason.find(callback);
        },
    }, function(err, results){
        if(err){return next(err);}
        res.render('catalog_create',{title: 'Create a Request', offices: results.offices, reasons: results.reasons});
    });
    
}

exports.peticion_create_post =[
    validator.body('name','Name is required').trim().isLength({min: 1}),
    validator.body('last_name','Lastname is required').trim().isLength({min: 1}),
    validator.body('cedula','Cedula is required').trim().isLength({min: 11}),
    validator.body('place_birth','Place of Birth is required').trim().isLength({min: 1}),
    validator.body('telephone','Telephone is required').trim().isLength({min: 1}),
    validator.body('address','Address is required').trim().isLength({min: 1}),
    validator.body('city','City is required').trim().isLength({min: 1}),
    validator.body('state','State is required').trim().isLength({min: 1}),
    validator.body('zip_code','Zip code is required').trim().isLength({min: 1}),
    validator.sanitizeBody('*').escape(),

    (req, res, next)=>{
        const errors = validator.validationResult(req);

        var request = new Solicitud(
            {
                name: req.body.name,
                last_name: req.body.last_name,
                cedula: req.body.cedula,
                birth_date: req.body.birth_date,
                place_birth: req.body.place_birth,
                pasaporte: req.body.pasaporte,
                telephone: req.body.telephone,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip_code: req.body.zip_code,
                last_passport: req.body.last_passport,
                passport_book: req.body.passport_book,
                last_passport_date: req.body.last_passport_date,
                picture_provided: req.body.picture_provided,
                cedula_provided: req.body.cedula_provided,
                birth_certificate_provided: req.body.birth_certificate_provided,
                last_passport_provided: req.body.last_passport_provided,
                request_type: req.body.request_type,
                status: req.body.status,
                description: req.body.description,
                office: req.body.office,
                reason: req.body.reason

            }
        )

        if(!errors.isEmpty()){
            
            async.parallel({
                offices: function(callback){
                    Office.find(callback);
                },
                reasons: function(callback){
                    Reason.find(callback);
                },
            }, function(err, results){
                if(err) {return next(err);}
                res.render('catalog_create', {title: 'Create a Request', request: request, offices: results.offices, reasons: results.reasons, errors: errors.array()});
            });
            return;
        }
        else {
            request.save(function(err){
                if(err){return next(err);}
                res.redirect(request.url);
            })
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
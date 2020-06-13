var Office = require('../models/office');
var Solicitud = require('../models/solicitud');
const validator = require('express-validator');

var async = require('async');

exports.show_all = function(req, res, next){
    Office.find({}).exec(function(err, office_list){
        if(err) {return next(error);}
        res.render('office_list',{title: "Office List", office_list: office_list, office_in_request: req.query});
    });
}

exports.create = function(req, res){
    res.render('office_create', {title: 'Create an Office'})
}

exports.create_post = [
    validator.body('name','Name is required').trim().isLength({min: 1}),
    validator.sanitizeBody('name').escape(),

    (req, res, next)=>{
        const errors = validator.validationResult(req);
        var office = new Office(
            {
                name: req.body.name
            }
        );

        if(!errors.isEmpty()){
            res.render('office_create', {title: 'Create an Office', office: office, errors: errors.array()})
        }else{
            Office.findOne({'name': req.body.name.toLowerCase().trim()})
                .exec(function(err, found_office){
                    if(err) {return next(err);}

                    if(found_office){
                        res.redirect('/office/all');
                    }else{
                        office.save(function(err){
                            if(err) {return next(err);}

                            res.redirect('/office/all');
                        });
                    }
                })
        }
    }
];

exports.update_get = function(req, res, next){
    Office.findById(req.params.id).exec(function(err, officeResult){
        if(err){return next(err);}

        res.render('office_update', {title: 'Update Office', office: officeResult})
    })
}

exports.update_post = [
    validator.body('name','Name is required').trim().isLength({min: 1}),
    validator.sanitizeBody('name').escape(),

    (req, res, next)=>{
        const errors = validator.validationResult(req);
        var office = new Office(
            {
                name: req.body.name,
                _id: req.params.id
            }
        );
        if(!errors.isEmpty()){
            res.render('office_update', {title: 'Update Office', office: office, errors: errors.array()})
        }else{
            Office.findOne({'name': req.body.name})
                .exec(function(err, found_office){
                    if(err) {return next(err);}

                    if(found_office){
                        res.redirect('/office/all');
                    }else{

                        Office.findByIdAndUpdate(req.params.id, office, {}, function(err, updatedOffice){
                            if(err){return next(err);}
                            res.redirect('/office/all')
                        } )
                    }
                })
        }
    }
];

exports.delete_post = function(req, res, next){
    async.parallel({
        office: function(callback){
            Office.findById(req.params.id)
                .exec(callback);
        },
        request: function(callback){
            Solicitud.find({'office': req.params.id})
                .exec(callback)
        }

    }, function(err, results){
        if(err){return next(err);}
        console.log(results);
        if(results.request.length > 0){
            return res.redirect('/office/all?request=true');
        }
        Office.findByIdAndRemove(req.params.id, function deleteOffice(err){
            if(err){return next(err);}
            return res.redirect('/office/all');
        })

    });

}
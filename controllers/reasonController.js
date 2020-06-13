var Reason = require('../models/reason');
var Solicitud = require('../models/solicitud')
const validator = require('express-validator');

var async = require('async');

exports.show_all = function(req, res, next){
    Reason.find({}).exec(function(err, reason_list){
        if(err) {return next(err);}
        res.render('reason_list', {title: "Reason List", reason_list: reason_list, reason_in_request: req.query});
    });
}

exports.create = function(req, res){
    res.render('reason_create', {title: 'Create a Reason'});
}

exports.create_post = [
    validator.body('name', 'Name is required').trim().isLength({min: 1}),
    validator.sanitizeBody('name').escape(),

    (req, res, next) => {
        const errors = validator.validationResult(req);
        var reason = new Reason(
            {
            name: req.body.name
            }
        );
        if(!errors.isEmpty()){
            res.render('reason_create', {title: "Create a Reason", reason: reason, errors: errors.array()})
        }else{
            Reason.findOne({'name': req.body.name})
                .exec(function(err, found_reason){
                    if(err) {return next(err);}

                    if(found_reason){
                        res.redirect('reason/all');
                    }else{
                        reason.save(function(err){
                            if(err){return next(err);}

                            res.redirect('/reason/all');
                        });
                    }
                })
        }

    }
];

exports.update_get = function(req, res, next){
    Reason.findById(req.params.id).exec(function(err, reasonResult){
        if(err){return next(err);}

        res.render('reason_update', {title: 'Update Reason', reason: reasonResult})
    })
}

exports.update_post = [
    validator.body('name','Name is required').trim().isLength({min: 1}),
    validator.sanitizeBody('name').escape(),

    (req, res, next)=>{
        const errors = validator.validationResult(req);
        var reason = new Reason(
            {
                name: req.body.name,
                _id: req.params.id
            }
        );
        if(!errors.isEmpty()){
            res.render('reason_update', {title: 'Update Reason', reason: reason, errors: errors.array()})
        }else{
            Reason.findOne({'name': req.body.name})
                .exec(function(err, found_reason){
                    if(err) {return next(err);}

                    if(found_reason){
                        res.redirect('/reason/all');
                    }else{

                        Reason.findByIdAndUpdate(req.params.id, reason, {}, function(err, updatedReason){
                            if(err){return next(err);}
                            res.redirect('/reason/all')
                        } )
                    }
                })
        }
    }
];

exports.delete_post = function(req, res, next){
    async.parallel({
        reason: function(callback){
            Reason.findById(req.params.id)
                .exec(callback);
        },
        request: function(callback){
            Solicitud.find({'reason': req.params.id})
                .exec(callback)
        }

    }, function(err, results){
        if(err){return next(err);}
        if(results.request.length > 0){
            return res.redirect('/reason/all?request=true');
        }
        Reason.findByIdAndRemove(req.params.id, function deleteReason(err){
            if(err){return next(err);}
            return res.redirect('/reason/all');
        })

    });

}
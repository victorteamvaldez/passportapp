var Reason = require('../models/reason');
const validator = require('express-validator');

exports.show_all = function(req, res, next){
    Reason.find({}).exec(function(err, reason_list){
        if(err) {return next(err);}
        res.render('reason_list', {title: "Reason List", reason_list: reason_list});
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
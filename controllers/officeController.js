var Office = require('../models/office');
const validator = require('express-validator');

var async = require('async');

exports.show_all = function(req, res, next){
    Office.find({}).exec(function(err, office_list){
        if(err) {return next(error);}
        res.render('office_list',{title: "Office List", office_list: office_list});
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
            Office.findOne({'name': req.body.name})
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
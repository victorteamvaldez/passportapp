var express = require('express');
var router = express.Router();

var office_controller = require('../controllers/officeController');

router.get('/all', office_controller.show_all);

router.get('/create', office_controller.create);

router.post('/create', office_controller.create_post);

module.exports=router;

var express = require('express');
var router = express.Router();

var office_controller = require('../controllers/officeController');

router.get('/all', office_controller.show_all);

router.get('/create', office_controller.create);

router.post('/create', office_controller.create_post);

router.post('/:id/delete', office_controller.delete_post);

router.get('/:id/update', office_controller.update_get);

router.post('/:id/update', office_controller.update_post);

module.exports=router;

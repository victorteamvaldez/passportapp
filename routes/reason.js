var express = require("express");
var router = express.Router();

var reason_controller = require('../controllers/reasonController');

router.get('/all', reason_controller.show_all);

router.get('/create', reason_controller.create);

router.post('/create', reason_controller.create_post);

router.post('/:id/delete', reason_controller.delete_post);

router.get('/:id/update', reason_controller.update_get);

router.post('/:id/update', reason_controller.update_post);

module.exports = router;
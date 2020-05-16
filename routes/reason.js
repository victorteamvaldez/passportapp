var express = require("express");
var router = express.Router();

var reason_controller = require('../controllers/reasonController');

router.get('/all', reason_controller.show_all);

router.get('/create', reason_controller.create);

router.post('/create', reason_controller.create_post);

module.exports = router;
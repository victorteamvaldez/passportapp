var express = require('express');
var router = express.Router();

var catalog_controller = require('../controllers/catalogController')


router.get('/',catalog_controller.index);

// Get all petitions

router.get('/all', catalog_controller.peticion_list);

//Get to create a new petition
router.get('/create',catalog_controller.peticion_create_get);

//Get a specific petition

router.get('/:id', catalog_controller.peticion_detail);

//Post for creatin a petition
router.post('/create', catalog_controller.peticion_create_post);

//Get Delete form
router.get('/:id/delete', catalog_controller.peticion_delete_get);

router.post('/:id/delete', catalog_controller.peticion_delete_post);

//Get y Post para hace un Update
router.get('/:id/update', catalog_controller.peticion_update_get);

router.post('/:id/update', catalog_controller.peticion_update_post);



// About Page

router.get('/about', function(req, res){
    res.send('About page');
})


module.exports=router;
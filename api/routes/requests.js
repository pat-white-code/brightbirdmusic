const express = require('express');
const router = express.Router();
const controller = require('../controllers/requests');

router.post('/', controller.postRequest);



module.exports = router;
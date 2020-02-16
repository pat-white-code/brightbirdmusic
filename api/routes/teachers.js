const express = require('express');
const router = express.Router();
const controller = require('../controllers/teachers');

router.get('/', controller.getTeachers);
router.get('/all', controller.getAllTeachers);


module.exports = router;
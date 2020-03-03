const express = require('express');
const router = express.Router();
const controller = require('../controllers/students');

router.get('/', controller.getStudents);
router.get('/lessons/:student_id', controller.getLessonsByStudent);

router.post('/', controller.postStudent);

module.exports = router;

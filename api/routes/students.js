const express = require('express');
const router = express.Router();
const controller = require('../controllers/students');

router.get('/', controller.getStudents);
router.get('/lessons/:student_id', controller.getLessonsByStudent);

module.exports = router;

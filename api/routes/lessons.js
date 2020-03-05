const express = require('express');
const router = express.Router();
const controller = require('../controllers/lessons');

router.get('/unlogged/:teacherId', controller.getUnloggedLessons);

router.put('/:lessonId/attendance', controller.takeAttendance);
router.put('/attendance/bulk', controller.bulkTakeAttendance);


module.exports = router;
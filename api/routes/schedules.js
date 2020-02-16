const express = require('express');
const router = express.Router();
const controller = require('../controllers/schedules');

router.get('/:teacher_id', controller.getTeacherSchedule);
router.get('/lessons/:schedule_id', controller.getLessonsByScheduleId);

module.exports = router;
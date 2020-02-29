const express = require('express');
const router = express.Router();
const controller = require('../controllers/schedules');

router.get('/:teacher_id', controller.getTeacherSchedule);
router.get('/lessons/:schedule_id', controller.getLessonsByScheduleId);

router.put('/:teacherId', controller.putSchedules);

module.exports = router;
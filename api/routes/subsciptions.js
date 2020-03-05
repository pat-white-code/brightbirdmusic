const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscriptions');

router.get('/client/:client_id', controller.getClientSubscriptions);
router.get('/requests/client/:clientId', controller.getClientRequests);
router.get('/:subscriptionId', controller.getSubscriptionInfo);
router.get('/teacher/:teacherId', controller.getTeacherSubscriptions);

router.post('/', controller.postSubscription, controller.postSubscriptionLessons, controller.mailNewSubscription);

router.post('/send', controller.mailNewSubscription);

router.put('/:subscriptionId', controller.putSubscription);
router.put('/lesson/:lessonId', controller.putLesson);

module.exports = router;
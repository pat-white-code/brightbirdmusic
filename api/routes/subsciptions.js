const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscriptions');

router.get('/client/:client_id', controller.getClientSubscriptions);
router.get('/requests/client/:clientId', controller.getClientRequests);

router.post('/', controller.postSubscription);

module.exports = router;
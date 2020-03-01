const getClientSubscriptions = require('./modules/subscriptions/getClientSubscriptions');
const getClientRequests = require('./modules/subscriptions/getClientRequests');
const postSubscription = require('./modules/subscriptions/postSubscription');


module.exports = {
  getClientSubscriptions,
  getClientRequests,
  postSubscription
}
const getClientSubscriptions = require('./modules/subscriptions/getClientSubscriptions');
const getClientRequests = require('./modules/subscriptions/getClientRequests');
const postSubscription = require('./modules/subscriptions/postSubscription');
const postSubscriptionLessons = require('./modules/subscriptions/postSubscriptionLessons');


module.exports = {
  getClientSubscriptions,
  getClientRequests,
  postSubscription,
  postSubscriptionLessons
}
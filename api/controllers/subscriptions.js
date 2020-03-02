const getClientSubscriptions = require('./modules/subscriptions/getClientSubscriptions');
const getClientRequests = require('./modules/subscriptions/getClientRequests');
const postSubscription = require('./modules/subscriptions/postSubscription');
const postSubscriptionLessons = require('./modules/subscriptions/postSubscriptionLessons');
const mailNewSubscription = require('./modules/subscriptions/mailNewSubscription');
const getSubscriptionInfo = require('./modules/subscriptions/getSubscriptionInfo');


module.exports = {
  getClientSubscriptions,
  getClientRequests,
  postSubscription,
  postSubscriptionLessons,
  mailNewSubscription,
  getSubscriptionInfo
}
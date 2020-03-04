const getClientRequests = require('./modules/requests/getClientRequests');
const postRequest = require('./modules/requests/postRequest');
const mailRequest = require('./modules/requests/mailRequest');
const getRequestInfo = require('./modules/requests/getRequestInfo');

module.exports = {
  postRequest, 
  getClientRequests,
  mailRequest,
  getRequestInfo
};
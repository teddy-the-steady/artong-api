const httpRequest = require('../utils/http/request');
const httpResponse = require('../utils/http/response');
const testListController = require('../controllers/testListController');
const testViewController = require('../controllers/testViewController');
const testCreateController = require('../controllers/testCreateController');

module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const requestInfo = httpRequest.init(event);

  let res = {};

  try {
    switch (requestInfo.httpMethod) {
      case 'GET':
        if (requestInfo.path === '/test/product' || requestInfo.path === '/test/product/')
          res = await testListController.control(requestInfo.queryStringParameters);
        else if (requestInfo.path.startsWith('/test/product/') && requestInfo.pathParameters)
          res = await testViewController.control(requestInfo.queryStringParameters, requestInfo.pathParameters);
        break;
      case 'POST':
        requestInfo.body = JSON.parse(requestInfo.body);
        if (requestInfo.path === '/test/product' || requestInfo.path === '/test/product/')
          res = await testCreateController.control(requestInfo.body);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    httpResponse.errorResponse(event, error, callback);
  }

  httpResponse.successResponse(event, res, callback);
};
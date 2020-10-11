export {};
const init = require('../inits');
const httpRequest = require('../utils/http/request');
const httpResponse = require('../utils/http/response');
const testListController = require('../controllers/testListController');
const testViewController = require('../controllers/testViewController');
const testCreateController = require('../controllers/testCreateController');

module.exports.handler = async (event: any, context: any, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let res = {};

  try {
    const requestInfo = httpRequest.init(event);
    console.log(requestInfo);

    switch (requestInfo.httpMethod) {
      case 'GET':
        /* /test */
        if (requestInfo.path === '/test/product' || requestInfo.path === '/test/product/')
          res = await testListController.control(requestInfo.queryStringParameters);
        else if (requestInfo.path.startsWith('/test/product/') && requestInfo.pathParameters)
          res = await testViewController.control(requestInfo.queryStringParameters, requestInfo.pathParameters);
        break;
      case 'POST':
        /* /test */
        if (requestInfo.path === '/test/product' || requestInfo.path === '/test/product/')
          res = await testCreateController.control(requestInfo.userId, requestInfo.body);
        break;
      default:
        break;
    }
  } catch (error) {
    httpResponse.errorResponse(event, error, callback);
  }

  httpResponse.successResponse(event, res, callback);
};
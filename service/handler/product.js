const httpRequest = require('../utils/http/request');
const httpResponse = require('../utils/http/response');
const productListController = require('../controllers/productControllers/productListController');
const productViewController = require('../controllers/productControllers/productViewController');
const productCreateController = require('../controllers/productControllers/productCreateController');

module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const requestInfo = httpRequest.init(event);
  
  let res = {};

  try {
    switch (requestInfo.httpMethod) {
      case 'GET':
        if (requestInfo.path === '/artong/v1/product' || requestInfo.path === '/artong/v1/product/')
          res = await productListController.control(requestInfo.queryStringParameters);
        else if (requestInfo.path.startsWith('/artong/v1/product/') && requestInfo.pathParameters)
          res = await productViewController.control(requestInfo.queryStringParameters, requestInfo.pathParameters);
        break;
      case 'POST':
        requestInfo.body = JSON.parse(requestInfo.body);
        if (requestInfo.path === '/artong/v1/product' || requestInfo.path === '/artong/v1/product/')
          res = await productCreateController.control(requestInfo.cognitoUser, requestInfo.body);
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
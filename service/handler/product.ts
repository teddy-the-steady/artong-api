export {};
const init = require('../inits'); // TODO] handler 이전 선언이 최초 이후 인스턴스 호출에도 유효한지 확인
const httpRequest = require('../utils/http/request');
const httpResponse = require('../utils/http/response');
const productListController = require('../controllers/productControllers/productListController');
const productViewController = require('../controllers/productControllers/productViewController');
const productCreateController = require('../controllers/productControllers/productCreateController');

module.exports.handler = async (event: any, context: any, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let res = {};

  try {
    const requestInfo = httpRequest.init(event);
    console.log(requestInfo);

    switch (requestInfo.httpMethod) {
      case 'GET':
        /* /product */
        if (requestInfo.path === '/artong/v1/product' || requestInfo.path === '/artong/v1/product/')
          res = await productListController.control(requestInfo.queryStringParameters);
        else if (requestInfo.pathParameters && requestInfo.path.startsWith('/artong/v1/product/'))
          res = await productViewController.control(requestInfo.queryStringParameters, requestInfo.pathParameters);
        /* /order */
        // else if (requestInfo.path === '/refdm/v1/order' || requestInfo.path === '/refdm/v1/order/')
        //   res = await orderListController.control(requestInfo.queryStringParameters);
        // else if (requestInfo.pathParameters && !isNaN(requestInfo.pathParameters['orderId']) && requestInfo.path.replace('/' + requestInfo.pathParameters['orderId'], '/') === '/refdm/v1/order/')
        //   res = await orderDetailListController.control(requestInfo.queryStringParameters, requestInfo.pathParameters);
        // else if (requestInfo.pathParameters && requestInfo.path.replace('/' + requestInfo.pathParameters['barcode'], '/') === '/refdm/v1/order/product/')
        //   res = await orderProductListController.control(requestInfo.queryStringParameters, requestInfo.pathParameters);
        break;
      case 'POST':
        /* /product */
        if (requestInfo.path === '/artong/v1/product' || requestInfo.path === '/artong/v1/product/')
          res = await productCreateController.control(requestInfo.userId, requestInfo.body);
        break;
      default:
        break;
    }
  } catch (error) {
    httpResponse.errorResponse(event, error, callback);
  }

  httpResponse.successResponse(event, res, callback);
};
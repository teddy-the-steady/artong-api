import init from '../init' // TODO] handler 이전 선언이 최초 이후 인스턴스 호출에도 유효한지 확인
import {request} from '../utils/http/request'
import {successResponse, errorResponse} from '../utils/http/response'
const testListController = require('../controllers/testListController');
import {testViewController} from '../controllers/testViewController'
const testCreateController = require('../controllers/testCreateController');

module.exports.handler = async (event: any, context: any, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let res = {};

  try {
    const requestInfo = request(event);
    console.log(requestInfo);

    switch (requestInfo.httpMethod) {
      case 'GET':
        /* /test */
        if (requestInfo.path === '/test/product' || requestInfo.path === '/test/product/')
          res = await testListController.control(requestInfo.queryStringParameters);
        else if (requestInfo.path.startsWith('/test/product/') && requestInfo.pathParameters)
          res = await testViewController(requestInfo.queryStringParameters, requestInfo.pathParameters);
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
    errorResponse(event, error, callback);
  }

  successResponse(event, res, callback);
};
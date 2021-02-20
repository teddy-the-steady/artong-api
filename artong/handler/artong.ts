export {};
const init = require('../init');
const httpRequest = require('../utils/http/request');
const httpResponse = require('../utils/http/response');
const {testListController, testViewController, testCreateController} = require('../controllers/test');
const {createMember} = require('../controllers/member');

module.exports.handler = async (event: any, context: any, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    const req = httpRequest.requestInit(event);
    console.log(req);

    switch (req.httpMethod) {
      case 'GET':
        /* /test */
        if (req.path === '/test/product' || req.path === '/test/product/')
          res = await testListController.control(req.queryStringParameters);
        else if (req.path.startsWith('/test/product/') && req.pathParameters)
          res = await testViewController.control(req.pathParameters, req.queryStringParameters);
        break;
      case 'POST':
        /* /test */
        if (req.path === '/test/product' || req.path === '/test/product/')
          res = await testCreateController.control(req.body);
        /* /member */
        else if (req.path === '/member' || req.path === '/member/')
          res = await createMember.control(req.body);
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
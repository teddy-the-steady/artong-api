export {};
const init = require('../init');
const httpRequest = require('../utils/http/request');
const httpResponse = require('../utils/http/response');
const {test, member} = require('../controllers');

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
          res = await test.getTests(req.queryStringParameters);
        else if (req.path.startsWith('/test/product/') && req.pathParameters)
          res = await test.getTest(req.pathParameters, req.queryStringParameters);
        break;
      case 'POST':
        /* /test */
        if (req.path === '/test/product' || req.path === '/test/product/')
          res = await test.createTest(req.body);
        /* /member */
        else if (req.path === '/artong/v1/member' || req.path === '/artong/v1/member/')
          res = await member.createMember(req.body);
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
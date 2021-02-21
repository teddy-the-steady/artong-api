import * as init from '../init';
import requestInit  from '../utils/http/request';
import { successResponse, errorResponse } from '../utils/http/response'
import { test, member } from '../controllers/index';

export async function handler(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    const req = requestInit(event);
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
    errorResponse(event, error, callback);
  }

  successResponse(event, res, callback);
};
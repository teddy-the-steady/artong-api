import * as init from '../init';
import requestInit  from '../utils/http/request';
import { successResponse, errorResponse } from '../utils/http/response'
import { member, status, country } from '../controllers/index';

export async function handler(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    const req = requestInit(event);
    console.log(req);

    switch (req.httpMethod) {
      case 'GET':
        /* /status */
        if (req.path === '/artong/v1/status' || req.path === '/artong/v1/status/')
          res = await status.getStatusList(req.queryStringParameters);
        break;
      case 'POST':
        /* /member */
        if (req.path === '/artong/v1/memberMaster' || req.path === '/artong/v1/memberMaster/')
          res = await member.createMember(req.body);
        /* /status */
        else if (req.path === '/artong/v1/status' || req.path === '/artong/v1/status/')
          res = await status.createStatus(req.body);
        /* /country */
        else if (req.path === '/artong/v1/country' || req.path === '/artong/v1/country/')
        res = await country.createCountry(req.body);
        break;
      case 'PUT':
        /* /status */
        if (req.pathParameters && req.path.startsWith('/artong/v1/status/'))
          res = await status.putStatus(req.pathParameters, req.body);
        break;
      default:
        console.log('METHOD undefined');
        break;
    }
  } catch (error) {
    errorResponse(event, error, callback);
  }

  successResponse(event, res, callback);
};
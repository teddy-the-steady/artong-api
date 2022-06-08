import 'reflect-metadata';
import requestInit from '../utils/http/request';
import { successResponse, errorResponse } from '../utils/http/response';
import { member, country, reactions } from '../controllers/artong/index';

export async function handler(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    const req = await requestInit(event);
    console.log(req);

    switch (req.httpMethod) {
      case 'GET':
        if (req.path === '/artong/v1/member')
          res = await member.getMemberOfUsername(req.queryStringParameters);
        else if (req.path.startsWith('/artong/v1/member/'))
          res = await member.getMember(req.pathParameters);
        else if (req.path.startsWith('/artong/v1/auth/member/'))
          res = await member.getMemberSecure(req.pathParameters);
        break;
      case 'POST':
        if (req.path === '/artong/v1/member' || req.path === '/artong/v1/member/')
          res = await member.createMember(req.body);
        else if (req.path === '/artong/v1/country' || req.path === '/artong/v1/country/')
          res = await country.createCountry(req.body, req.user);
        else if (req.path.startsWith('/artong/v1/contents/') && req.pathParameters && req.path.includes('/reactions'))
          res = await reactions.createContentReaction(req.pathParameters, req.body, req.user);
        break;
      case 'PATCH':
        if (req.path === '/artong/v1/memberMaster')
          res = await member.patchMemberMaster(req.body, req.user);
        else if (req.path === '/artong/v1/memberDetail')
          res = await member.patchMemberDetail(req.body, req.user);
        else if (req.path.startsWith('/artong/v1/profilePic/'))
            res = await member.patchMemberProfilePic(req.pathParameters, req.body);
        break;
      default:
        console.error('METHOD undefined');
        break;
    }
  } catch (error) {
    errorResponse(event, error, callback);
  }

  successResponse(event, res, callback);
};
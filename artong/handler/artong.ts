import 'reflect-metadata';
import requestInit from '../utils/http/request';
import { successResponse, errorResponse } from '../utils/http/response';
import { member, country, reactions, projects } from '../controllers/artong/index';

export async function handler(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    const req = await requestInit(event);
    console.log(req);

    switch (req.httpMethod) {
      case 'GET':
        if (req.path === '/artong/v1/members' || req.path === '/artong/v1/members/')
          res = await member.getMembers(req.queryStringParameters);
        else if (req.path.startsWith('/artong/v1/members/') && req.pathParameters)
          res = await member.getMember(req.pathParameters);
        break;
      case 'POST':
        if (req.path === '/artong/v1/member' || req.path === '/artong/v1/member/')
          res = await member.postMember(req.body);
        else if (req.path === '/artong/v1/country' || req.path === '/artong/v1/country/')
          res = await country.postCountry(req.body, req.member);
        else if (req.path.startsWith('/artong/v1/contents/') && req.pathParameters && req.path.includes('/reactions'))
          res = await reactions.postContentReaction(req.pathParameters, req.body, req.member);
        else if (req.path === '/artong/v1/projects' || req.path === '/artong/v1/projects/')
          res = await projects.postProject(req.body, req.member);
        break;
      case 'PATCH':
        if (req.path.startsWith('/artong/v1/members/') && req.pathParameters && req.path.includes('profile_pic'))
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
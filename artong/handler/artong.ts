import 'reflect-metadata';
import requestInit from '../utils/http/request';
import { successResponse, errorResponse } from '../utils/http/response';
import { member, status, country, uploads } from '../controllers/artong/index';

export async function handler(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    const req = await requestInit(event);
    console.log(req);

    switch (req.httpMethod) {
      case 'GET':
        if (req.path.startsWith('/artong/v1/member/'))
          res = await member.getMember(req.pathParameters);
        else if (req.path.startsWith('/artong/v1/auth/member/'))
          res = await member.getMemberSecure(req.pathParameters);
        else if (req.path === '/artong/v1/status' || req.path === '/artong/v1/status/')
          res = await status.getStatusList(req.queryStringParameters, req.userGroups);
        else if (req.path === '/artong/v1/uploads' || req.path === '/artong/v1/uploads/')
          res = await uploads.getUploadsList(req.queryStringParameters);
        else if (req.path === '/artong/v1/auth/uploads' || req.path === '/artong/v1/auth/uploads/')
          res = await uploads.getAuthUserUploadsList(req.queryStringParameters, req.userId);
        break;
      case 'POST':
        if (req.path === '/artong/v1/member' || req.path === '/artong/v1/member/')
          res = await member.createMember(req.body);
        else if (req.path === '/artong/v1/status' || req.path === '/artong/v1/status/')
          res = await status.createStatus(req.body, req.userGroups);
        else if (req.path === '/artong/v1/country' || req.path === '/artong/v1/country/')
          res = await country.createCountry(req.body, req.userGroups);
        else if (req.path === '/artong/v1/uploads' || req.path === '/artong/v1/uploads/')
          res = await uploads.createUpload(req.body);
        else if (req.path.startsWith('/artong/v1/uploads/') && req.pathParameters && req.path.includes('/actions'))
          res = await uploads.createUploadAction(req.pathParameters, req.body, req.userId);
        break;
      case 'PUT':
        if (req.path.startsWith('/artong/v1/status/') && req.pathParameters)
          res = await status.putStatus(req.pathParameters, req.body, req.userGroups);
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
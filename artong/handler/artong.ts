import 'reflect-metadata';
import requestInit from '../utils/http/request';
import { successResponse, errorResponse } from '../utils/http/response';
import { member, country, reactions, projects, contents } from '../controllers/artong/index';
import { graphql } from './graphql'
import { getDbConnentionPool } from '../init';
import { Pool } from 'pg';

export let dbConnectionPool: Pool;

export async function handler(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    if (!dbConnectionPool) {
      dbConnectionPool = await getDbConnentionPool();
    }
    const req = await requestInit(event);
    console.log(req);

    switch (req.httpMethod) {
      case 'GET':
        if (req.path === '/artong/v1/members' || req.path === '/artong/v1/members/')
          res = await member.getMembers(req.queryStringParameters);
        else if (req.path.startsWith('/artong/v1/members/') && req.pathParameters)
          res = await member.getMember(req.pathParameters);
        else if (req.path.startsWith('/artong/v1/projects/') && req.pathParameters) {
          if (req.path.includes('/tx_receipt_updated'))
            res = await projects.getProjectWhileUpdatingPendingToCreated(req.pathParameters, req.member);
          else
           res = await projects.getProject(req.pathParameters);
        }
        else if (req.path === '/artong/v1/projects' || req.path === '/artong/v1/projects/')
          res = await projects.getProjects(req.queryStringParameters);
        else if (req.path.startsWith('/artong/v1/nft/') && req.pathParameters)
          res = await contents.getContent(req.pathParameters);
        break;
      case 'POST':
        if (req.path === '/artong/v1/members' || req.path === '/artong/v1/members/')
          res = await member.postMember(req.body);
        else if (req.path === '/artong/v1/country' || req.path === '/artong/v1/country/')
          res = await country.postCountry(req.body, req.member);
        else if (req.path.startsWith('/artong/v1/contents/') && req.pathParameters && req.path.includes('/reactions'))
          res = await reactions.postContentReaction(req.pathParameters, req.body, req.member);
        else if (req.path === '/artong/v1/projects' || req.path === '/artong/v1/projects/')
          res = await projects.postProject(req.body, req.member);
        else if (req.path === '/artong/v1/nft' || req.path === '/artong/v1/nft/')
          res = await contents.postContent(req.body, req.member);
        else if (req.path === '/artong/v1/nft/storage' || req.path === '/artong/v1/nft/storage/')
          res = await contents.uploadToNftStorage(req.body);
        else if (req.path === '/artong/v1/graphql' || req.path === '/artong/v1/graphql/')
          res = await graphql(req.body, req.member);
        break;
      case 'PATCH':
        if (req.path.startsWith('/artong/v1/members/') && req.path.includes('profile_s3key'))
          res = await member.patchMemberProfileS3key(req.body, req.member);
        else if (req.path.startsWith('/artong/v1/members/') && req.pathParameters && req.path.includes('profile_thumbnail_s3key'))
          res = await member.patchMemberProfileThumbnailS3key(req.pathParameters, req.body);
        else if (req.path.startsWith('/artong/v1/projects/') && req.pathParameters)
          res = await projects.patchProject(req.pathParameters, req.body, req.member);
        else if (req.path.startsWith('/artong/v1/nft/') && req.pathParameters)
          res = await contents.patchContent(req.pathParameters, req.body);
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
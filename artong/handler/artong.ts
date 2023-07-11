import 'reflect-metadata';
import requestInit from '../utils/http/request';
import { successResponse, errorResponse } from '../utils/http/response';
import { member, country, reactions, projects, contents, search, follow, main, report, notification } from '../controllers/artong/index';
import { graphql } from './graphql'
import { getDbConnentionPool } from '../init';
import { Pool } from 'pg';
import * as db from '../utils/db/db';

export let artongPool: Pool;

export async function handler(event: any, context: any, callback: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  let res: any = {};

  try {
    if (!artongPool) {
      artongPool = await getDbConnentionPool();
    }
    const conn = await db.getArtongConnection()
    const req = await requestInit(event, conn);
    console.log(req);

    switch (req.httpMethod) {
      case 'GET':
        if (req.path.startsWith('/artong/v1/members/') && req.pathParameters) {
          if (req.path.includes('/follow'))
            res = await member.getMemberFollowerOrFollowing(req.pathParameters, req.queryStringParameters);
          else if (req.path.includes('/subscribe'))
            res = await projects.getMemberSubscribedProjects(req.pathParameters, req.queryStringParameters);
          else if (req.path.includes('/contents')) {
            if (req.path.includes('/candidates')) {
              res = await contents.getMemberContentsCandidates(req.pathParameters, req.queryStringParameters, req.member);
            } else if (req.path.includes('/favorites')) {
              res = await contents.getMemberFavoritedContents(req.pathParameters, req.queryStringParameters);
            }
          }
          else
            res = await member.getMemberByUsername(req.pathParameters, req.member);
        }
        if (req.path === '/artong/v1/current_member' || req.path === '/artong/v1/current_member/')
          res = { data: req.member };
        if (req.path.startsWith('/artong/v1/projects/') && req.pathParameters) {
          if (req.path.includes('/tx_receipt_updated'))
            res = await projects.getProjectWhileUpdatingPendingToCreated(req.pathParameters, req.member);
          if (req.path.includes('/contributors'))
            res = await member.getProjectContributors(req.pathParameters, req.queryStringParameters);
          if (req.path.includes('/contents/tobe_approved'))
            res = await contents.getTobeApprovedContentsInProject(req.pathParameters, req.queryStringParameters);
          if (req.path.includes('/contents/') && req.pathParameters.contents_id)
            res = await contents.getContent(req.pathParameters, req.member)
        }
        if (req.path === '/artong/v1/projects' || req.path === '/artong/v1/projects/')
          res = await projects.getProjectsPrevNext(req.queryStringParameters);
        if (req.path.startsWith('/artong/v1/main/'))
          if (req.path.includes('/contents'))
            res = main.getMainContents();
          else if (req.path.includes('/contributors'))
            res = await main.getTop10Contributors();
        if (req.path.startsWith('/artong/v1/contents'))
          if (req.pathParameters && req.path.includes('/voucher'))
            res = await contents.getContentVoucherById(req.pathParameters, req.member);
          else
            res = await contents.getContents(req.queryStringParameters);
        if (req.path.startsWith('/artong/v1/search/'))
          if (req.path.includes('projects'))
            res = await search.searchProjects(req.queryStringParameters, req.member);
          else if (req.path.includes('contents'))
            res = await search.searchContents(req.queryStringParameters, req.member);
          else if (req.path.includes('members'))
            res = await search.searchMembers(req.queryStringParameters, req.member);
        if (req.path === '/artong/v1/feed' || req.path === '/artong/v1/feed/')
          res = await contents.getFeedContents(req.queryStringParameters, req.member);
        if (req.path === '/artong/v1/notification/get' || req.path === '/artong/v1/notification/get/')
          res = await notification.getNotifications(req.member, req.queryStringParameters)
        break;
      case 'POST':
        if (req.path === '/artong/v1/member' || req.path === '/artong/v1/member/')
          res = await member.postMember(req.body);
        if (req.path === '/artong/v1/country' || req.path === '/artong/v1/country/')
          res = await country.postCountry(req.body, req.member);
        if (req.path.startsWith('/artong/v1/contents'))
          if (req.path.includes('/artongs_pick'))
            res = await contents.getContentsPick(req.body);
          else if (req.path.includes('/storage'))
            res = await contents.uploadToNftStorageAndUpdateContent(req.body, req.member);
          else if (req.pathParameters && req.path.includes('/reactions'))
            res = await reactions.postContentReaction(req.pathParameters, req.body, req.member);
          else
            res = await contents.postContent(req.body, req.member);
        if (req.path === '/artong/v1/projects' || req.path === '/artong/v1/projects/')
          res = await projects.postProject(req.body, req.member);
        if (req.path === '/artong/v1/follow' || req.path === '/artong/v1/follow/')
          res = await follow.doFollowMemberOrUndo(req.body, req.member);
        if (req.path === '/artong/v1/subscribe' || req.path === '/artong/v1/subscribe/')
          res = await follow.doSubsribeProjectOrUndo(req.body, req.member);
        if (req.path === '/artong/v1/report' || req.path === '/artong/v1/report/')
          res = await report.postReport(req.body, req.member);
        if (req.path === '/artong/v1/send/email_verification' || req.path === '/artong/v1/send/email_verification/')
          res = await member.sendEmailVerification(req.body);
        if (req.path === '/artong/v1/verify/email' || req.path === '/artong/v1/verify/email/')
          res = await member.verifyEmail(req.body, req.member);
        if (req.path === '/artong/v1/graphql' || req.path === '/artong/v1/graphql/')
          res = await graphql(req.body, req.member);
        break;
      case 'PATCH':
        if (req.path.startsWith('/artong/v1/members/') && req.path.includes('profile_s3key'))
          res = await member.patchMemberProfileS3key(req.body, req.member);
        if (req.path.startsWith('/artong/v1/members/') && req.pathParameters)
          if (req.path.includes('profile_thumbnail_s3key'))
            res = await member.patchMemberProfileThumbnailS3key(req.pathParameters, req.body);
          else
            res = await member.patchMember(req.body, req.pathParameters, req.member);
        if (req.path.startsWith('/artong/v1/projects/') && req.pathParameters)
          if (req.path.includes('/contents') && req.path.includes('/status'))
            res = await contents.patchContentStatus(req.pathParameters, req.body, req.member);
          else
            res = await projects.patchProject(req.pathParameters, req.body, req.member);
        if (req.path === '/artong/v1/projects/thumbnail_s3key' || req.path === '/artong/v1/projects/thumbnail_s3key/')
          res = await projects.patchProjectThumbnailS3key(req.body);
        if (req.path.startsWith('/artong/v1/contents/') && req.pathParameters)
          res = await contents.patchContent(req.pathParameters, req.body, req.member);
        if (req.path === '/artong/v1/contents/content_thumbnail_s3key' || req.path === '/artong/v1/contents/content_thumbnail_s3key/')
          res = await contents.patchContentThumbnailS3key(req.body);
        if(req.path === '/artong/v1/notification/read' || req.path === '/artong/v1/notification/read/')
          res = await notification.readNotifications(req.body);
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
import { Contents, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import getSecretKeys from '../../utils/common/ssmKeys';
import { getS3ObjectInBuffer, getS3ObjectHead } from '../../utils/common/commonFunc';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
import { Unauthorized } from '../../utils/error/errors';
import { NoPermission } from '../../utils/error/errorCodes';
import { PoolClient } from 'pg';
import { S3Client } from '@aws-sdk/client-s3';
import { NFTStorage } from 'nft.storage';
import { File } from '@web-std/file';
import _ from 'lodash';


const postContent = async function(body: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      member_id: member.id,
      project_address: body.project_address,
      content_s3key: body.content_s3key,
    }, conn);

    const result = await contentModel.createContent(
      contentModel.member_id,
      contentModel.project_address,
      contentModel.content_s3key
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const uploadToNftStorage = async function(body: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const client = new S3Client({ region: 'ap-northeast-2' });
    const image = await getS3ObjectInBuffer(client, process.env.S3_BUCKET, body.imageKey);
    const head = await getS3ObjectHead(client, process.env.S3_BUCKET, body.imageKey);

    const fileName = body.imageKey.substring(body.imageKey.lastIndexOf('/') + 1, body.imageKey.length)
    const file = new File([image], fileName, { type: head.ContentType })

    const keys = await getSecretKeys();
    const nftStorageApiKey = keys[`/nftStorage/${process.env.ENV}/apikey`];

    const storage = new NFTStorage({ token: nftStorageApiKey });
    const metadata = await storage.store({
      name: body.name,
      description: body.description,
      image: file
    });

    return {data: metadata}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchContent = async function(pathParameters: any, body: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      id: pathParameters.id,
      ipfs_url: body.ipfs_url,
      token_id: body.tokenId,
      voucher: body.voucher,
      is_redeemed: body.isRedeemed,
    }, conn);

    const result = await contentModel.updateContent(
      contentModel.id,
      contentModel.ipfs_url,
      contentModel.token_id,
      contentModel.voucher,
      contentModel.is_redeemed,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const queryToken = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentsModel = new Contents({
      project_address: body.db.project_address,
      token_id: body.db.token_id
    }, conn);

    const [dbResult, gqlResult] = await Promise.all([
      contentsModel.getContent(contentsModel.project_address, contentsModel.token_id),
      graphqlRequest({query: pureQuery, variables: body.variables})
    ]);

    if (dbResult && gqlResult.token) {
      for (let field of _db_) {
        gqlResult.token[field] = (dbResult as any)[field];
      }
    } else {
      return {data: {token: {}}}
    }

    return {data: gqlResult}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const queryTokens = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.tokens.length === 0) {
      return {data: {tokens: []}}
    }

    const memberModel = new Member({}, conn);
    gqlResult.tokens = await memberModel.setOwnerFromMemberListTo(gqlResult.tokens);

    const contentModel = new Contents({}, conn);
    const extractedTokenIds = gqlResult.tokens.map((token: { tokenId: string; }) => parseInt(token.tokenId));
    const extractedProjectIds = gqlResult.tokens.map((token: { project : { id: string; } }) => token.project.id);

    const contentResult = await contentModel.getTokensWithIdArray(
      extractedTokenIds,
      extractedProjectIds,
      _db_
    );

    if (contentResult && gqlResult.tokens) {
      const merged = _.merge(_.keyBy(gqlResult.tokens, 'id'), _.keyBy(contentResult, 'id'))
      return {data: {tokens: _.values(merged)}}
    } else {
      return {data: gqlResult}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const queryTokensByProject = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.tokens.length === 0) {
      return {data: {tokens: []}}
    }

    const memberModel = new Member({}, conn);
    gqlResult.tokens = await memberModel.setOwnerFromMemberListTo(gqlResult.tokens);

    const contentModel = new Contents({}, conn);
    const extractedTokenIds = gqlResult.tokens.map((token: { tokenId: string; }) => parseInt(token.tokenId));

    const contentResult = await contentModel.getTokensByProjectWithIdArray(
      extractedTokenIds,
      body.variables.project,
      _db_
    );

    if (contentResult && gqlResult.tokens) {
      const merged = _.merge(_.keyBy(gqlResult.tokens, 'id'), _.keyBy(contentResult, 'id'))
      return {data: {tokens: _.values(merged)}}
    } else {
      return {data: gqlResult}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const patchContentThumbnailS3key = async function(body:any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      content_s3key: body.content_s3key,
      content_thumbnail_s3key: body.content_thumbnail_s3key,
    }, conn);

    const result = await contentModel.updateContentThumbnailS3keys(
      contentModel.content_s3key,
      contentModel.content_thumbnail_s3key,
    );

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getMintReadyContentsInProject = async function(pathParameters: any, queryStringParameters: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    // TODO] query policy on every req for now. BEST is to listen event in our server and to syncronize with db
    const policyResult = await graphqlRequest({
      query: 'query Project($id: String) { project(id: $id) { policy } }',
      variables: {id: pathParameters.id}
    });
    if (policyResult.project.policy === 1) {
      throw new Unauthorized(NoPermission.message, NoPermission.code);
    }

    const contentModel = new Contents({
      project_address: pathParameters.id,
    }, conn);

    const result = await contentModel.getMintReadyContents(
      contentModel.project_address,
      queryStringParameters.start_num,
      queryStringParameters.count_num
    );

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getTobeApprovedContentsInProject = async function(pathParameters: any, queryStringParameters: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const ownerResult = await graphqlRequest({
      query: 'query Project($id: String) { project(id: $id) { owner } }',
      variables: {id: pathParameters.id}
    });
    if (ownerResult.project.owner !== member.wallet_address) {
      throw new Unauthorized(NoPermission.message, NoPermission.code);
    }

    const contentModel = new Contents({
      project_address: pathParameters.id,
    }, conn);

    const result = await contentModel.getMintReadyContents(
      contentModel.project_address,
      queryStringParameters.start_num,
      queryStringParameters.count_num
    );

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getContentVoucherById = async function(pathParameters: any) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      id: pathParameters.id
    }, conn)

    const result = await contentModel.getContentVoucherById(
      contentModel.id
    );

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const queryTokensByCreator = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.tokens.length === 0) {
      return {data: {tokens: []}}
    }

    const memberModel = new Member({}, conn);
    gqlResult.tokens = await memberModel.setOwnerFromMemberListTo(gqlResult.tokens);

    const contentModel = new Contents({}, conn);
    const extractedTokenIds = gqlResult.tokens.map((token: { tokenId: string; }) => parseInt(token.tokenId));

    const contentResult = await contentModel.getTokensByCreatorWithIdArray(
      extractedTokenIds,
      body.variables.creator,
      _db_
    );

    if (contentResult && gqlResult.tokens) {
      const merged = _.merge(_.keyBy(gqlResult.tokens, 'id'), _.keyBy(contentResult, 'id'))
      return {data: {tokens: _.values(merged)}}
    } else {
      return {data: gqlResult}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
	postContent,
  uploadToNftStorage,
  patchContent,
  queryToken,
  queryTokens,
  queryTokensByProject,
  patchContentThumbnailS3key,
  getMintReadyContentsInProject,
  getTobeApprovedContentsInProject,
  getContentVoucherById,
  queryTokensByCreator,
};
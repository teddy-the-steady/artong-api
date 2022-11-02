import { Contents, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import getSecretKeys from '../../utils/common/ssmKeys';
import { PoolClient } from 'pg';
import { getS3ObjectInBuffer, getS3ObjectHead } from '../../utils/common/commonFunc';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
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
      project_address: body.variables.project_address,
      token_id: body.variables.token_id
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

    const extractedOwners = gqlResult.tokens.map((token: { owner: string; }) => token.owner);
    const memberModel = new Member({walletAddressArray: extractedOwners}, conn);
    const memberResult = await memberModel.getMembersWithWalletAddressArray(extractedOwners);

    for (let token of gqlResult.tokens) {
      for (let member of memberResult) {
        if (token.owner === member.wallet_address) {
          token.owner = member
        }
      }
    }

    const extractedTokenIds = gqlResult.tokens.map((token: { tokenId: string; }) => parseInt(token.tokenId));
    const extractedProjectIds = gqlResult.tokens.map((token: { project : { id: string; } }) => token.project.id);
    const contentModel = new Contents({
      tokenIdArray: extractedTokenIds,
      projectAddressArray: extractedProjectIds
    }, conn);

    const contentResult = await contentModel.getTokensWithIdArray(
      contentModel.tokenIdArray,
      contentModel.projectAddressArray,
      _db_
    );

    if (contentResult && gqlResult.tokens && contentResult.length === gqlResult.tokens.length) {
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

    const extractedOwners = gqlResult.tokens.map((token: { owner: string; }) => token.owner);
    const memberModel = new Member({walletAddressArray: extractedOwners}, conn);
    const memberResult = await memberModel.getMembersWithWalletAddressArray(extractedOwners);

    for (let token of gqlResult.tokens) {
      for (let member of memberResult) {
        if (token.owner === member.wallet_address) {
          token.owner = member
        }
      }
    }

    const extractedTokenIds = gqlResult.tokens.map((token: { tokenId: string; }) => parseInt(token.tokenId));
    const contentModel = new Contents({
      tokenIdArray: extractedTokenIds,
      project_address: body.variables.project
    }, conn);

    const contentResult = await contentModel.getTokensByProjectWithIdArray(
      contentModel.tokenIdArray,
      contentModel.project_address,
      _db_
    );

    if (contentResult && gqlResult.tokens && contentResult.length === gqlResult.tokens.length) {
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
};
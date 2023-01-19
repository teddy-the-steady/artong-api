import { Contents, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import getSecretKeys from '../../utils/common/ssmKeys';
import { getS3ObjectInBuffer, getS3ObjectHead, calculateMinusBetweenTowSetsById } from '../../utils/common/commonFunc';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
import { PoolClient } from 'pg';
import { S3Client } from '@aws-sdk/client-s3';
import { NFTStorage } from 'nft.storage';
import { File } from '@web-std/file';
import _ from 'lodash';
import { ContentsHistory } from '../../models/contentsHistory/ContentsHistory';
import { PageAndOrderingInfo } from './index';

interface GetContentInfo {
  id: string
  contents_id: string
}
const getContent = async function(pathParameters: GetContentInfo, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      project_address: pathParameters.id,
      id: parseInt(pathParameters.contents_id),
    }, conn);

    const contentResult = await contentModel.getContentById(
      contentModel.project_address,
      contentModel.id,
      member?.id
    );
    if (!contentResult) {
      return {data: {}}
    }

    const result = makeMemberInfo([contentResult], [''], 'owner');

    return {data: result[0]}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

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

const uploadToNftStorageAndUpdateContent = async function(body: any) {
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

    const contentModel = new Contents({
      id: body.content_id,
      ipfs_url: metadata.url,
      name: body.name,
      description: body.description,
    }, conn);

    await contentModel.updateContent(
      contentModel.id,
      contentModel.ipfs_url,
      undefined, undefined, undefined,
      contentModel.name,
      contentModel.description,
    );

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
      name: body.name,
      description: body.description,
    }, conn);

    const result = await contentModel.updateContent(
      contentModel.id,
      contentModel.ipfs_url,
      contentModel.token_id,
      contentModel.voucher,
      contentModel.is_redeemed,
      contentModel.name,
      contentModel.description,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const patchContentStatus = async function(pathParameters: {id: string, contents_id: string}, body: {status: string}, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      id: parseInt(pathParameters.contents_id),
      project_address: pathParameters.id,
      member_id: member.id,
      status: body.status,
    }, conn);

    const result = await contentModel.updateContentStatus(
      contentModel.id,
      contentModel.project_address,
      contentModel.member_id,
      contentModel.status,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const queryToken = async function(body: any, _db_: string[], pureQuery: string, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentsModel = new Contents({
      project_address: body.db.project_address,
      token_id: body.db.token_id
    }, conn);

    const [dbResult, gqlResult] = await Promise.all([
      contentsModel.getContent(
        contentsModel.project_address,
        contentsModel.token_id,
        member?.id
      ),
      graphqlRequest({query: pureQuery, variables: body.variables})
    ]);

    if (gqlResult.token.project) {
      gqlResult.token.project['project_s3key'] = (dbResult as any)['project_s3key'];
      gqlResult.token.project['project_thumbnail_s3key'] = (dbResult as any)['project_thumbnail_s3key'];
    }

    const memberModel = new Member({}, conn);
    const memberResult = await memberModel.getMembersWithWalletAddressArray([
      gqlResult.token.owner,
      gqlResult.token.creator,
    ]);

    if (memberResult.length > 0) {
      if (gqlResult.token.owner === gqlResult.token.creator) {
        gqlResult.token.owner = memberResult[0];
        gqlResult.token.creator = memberResult[0];
      } else if (memberResult[0].wallet_address === gqlResult.token.owner) {
        gqlResult.token.owner = memberResult[0];
        gqlResult.token.creator = memberResult[1];
      } else if (memberResult[0].wallet_address === gqlResult.token.creator) {
        gqlResult.token.owner = memberResult[1];
        gqlResult.token.creator = memberResult[0];
      }
    }

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
    const extractedIds = gqlResult.tokens.map((token: { id: string; }) => token.id);

    let contentResult = await contentModel.getTokensWithIdArray(
      extractedIds,
      _db_
    );

    if (contentResult.length < gqlResult.tokens.length) {
      const tokens = calculateMinusBetweenTowSetsById(gqlResult.tokens, contentResult as any);
      await contentModel.updateContentTokenIds(tokens);
      contentResult = await contentModel.getTokensWithIdArray(
        extractedIds,
        _db_
      );
    }

    if (contentResult.length > 0) {
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
     // TODO] query policy on every req for now. BEST is to listen event in our server and to syncronize with db
    const [gqlResult, policyResult] = await Promise.all([
      graphqlRequest({query: pureQuery, variables: body.variables}),
      await graphqlRequest({
        query: 'query Project($id: String) { project(id: $id) { policy } }',
        variables: {id: body.variables.project,}
      })
    ]);

    const policy = policyResult.project.policy;
    const contentModel = new Contents({}, conn);
    if (gqlResult.tokens.length > 0) {
      const extractedTokenIds = gqlResult.tokens.map((token: { tokenId: string; }) => parseInt(token.tokenId));

      const updateCandidates = await contentModel.getTokensByProjectWithIdArray(
        extractedTokenIds,
        body.variables.project,
        _db_
      );

      if (updateCandidates.length < gqlResult.tokens.length) {
        const tokens = calculateMinusBetweenTowSetsById(gqlResult.tokens, updateCandidates as any);
        await contentModel.updateContentTokenIds(tokens);
      }
    }

    const contentsResult = await contentModel.getContents(
      body.variables.project,
      body.variables.start_num,
      body.variables.first,
      body.variables.orderBy,
      body.variables.orderDirection,
      policy,
    )

    let result: any[] = [];
    let subgraph_count = 0;

    if (contentsResult.length > 0) {
      result = _.map(contentsResult, (content) => {
        if (content.token_id && content.token_id > 0) {
          subgraph_count++
        }

        const token = _.find(gqlResult.tokens, {tokenURI: content.ipfs_url})
        if (token) {
          return _.merge(
            content,
            token
          );
        } else {
          return content
        }
      });

      const memberModel = new Member({}, conn);
      result = await memberModel.setOwnerFromMemberListTo(result);
    }

    return {data: {tokens: result, meta: {subgraph_count: subgraph_count}}}
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

const getTobeApprovedContentsInProject = async function(pathParameters: { id: string }, queryStringParameters: PageAndOrderingInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      project_address: pathParameters.id,
    }, conn);

    let result = await contentModel.getToBeApprovedContents(
      contentModel.project_address,
      queryStringParameters.start_num,
      queryStringParameters.count_num,
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );

    result = makeMemberInfo(result, [''], 'owner');

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getContentVoucherById = async function(pathParameters: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      id: pathParameters.id,
      member_id: member?.id
    }, conn)

    const result = await contentModel.getContentVoucherById(
      contentModel.id,
      contentModel.member_id
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
    const extractedSuggraphTokenIds = gqlResult.tokens.map((token: { id: string; }) => token.id);

    let contentResult = await contentModel.getTokensByCreatorWithIdArray(
      extractedSuggraphTokenIds,
      body.variables.creator,
      _db_
    );

    if (contentResult.length < gqlResult.tokens.length) {
      const tokens = calculateMinusBetweenTowSetsById(gqlResult.tokens, contentResult as any);
      await contentModel.updateContentTokenIds(tokens);
      contentResult = await contentModel.getTokensByCreatorWithIdArray(
        extractedSuggraphTokenIds,
        body.variables.creator,
        _db_
      );
    }

    if (contentResult.length > 0) {
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

const queryTokensByOwner = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.tokens.length === 0) {
      return {data: {tokens: []}}
    }

    const memberModel = new Member({}, conn);
    gqlResult.tokens = await memberModel.setOwnerFromMemberListTo(gqlResult.tokens);

    const contentModel = new Contents({}, conn);
    const extractedIds = gqlResult.tokens.map((token: { id: string; }) => token.id);

    let contentResult = await contentModel.getTokensWithIdArray(
      extractedIds,
      _db_
    );

    if (contentResult.length < gqlResult.tokens.length) {
      const tokens = calculateMinusBetweenTowSetsById(gqlResult.tokens, contentResult as any);
      await contentModel.updateContentTokenIds(tokens);
      contentResult = await contentModel.getTokensWithIdArray(
        extractedIds,
        _db_
      );
    }

    if (contentResult.length > 0) {
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

const queryTokenHistory = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (!gqlResult.token) {
      return {data: {token: {}}}
    }

    const contentsHistoryModel = new ContentsHistory({}, conn);

    if (body.pagination.start_num === 0) {
      const result = await contentsHistoryModel.getLatestContentsHistory(
        gqlResult.token.project.id,
        gqlResult.token.tokenId
      );

      type Histories = {
        [key: string]: any[];
      }
      const histories: Histories = {
        transfers: gqlResult.token.transfers,
        offers: gqlResult.token.offers,
        sales: gqlResult.token.sales,
        listings: gqlResult.token.listings,
      };

      if (result) {
        if (result.block_timestamp) {
          const contentsHistoryInsertData: any[] = [];
          for (let key in histories) {
            for (let history of histories[key as string]) {
              if (history.createdAt <= result.block_timestamp) {
                break;
              } else {
                makeContentsHistoryInsertData(
                  contentsHistoryInsertData,
                  history,
                  key,
                );
              }
            }
          }

          if (contentsHistoryInsertData.length > 0) {
            await contentsHistoryModel.createContentsHistories(
              contentsHistoryInsertData,
              gqlResult.token.project.id,
              gqlResult.token.tokenId,
            );
          }
        }
      } else {
        const contentsHistoryInsertData = [{
          from_member_id: '0x0000000000000000000000000000000000000000',
          to_member_id: gqlResult.token.creator,
          history_type: 'MINTED',
          price: null,
          subgraph_raw: null,
          tx_hash: gqlResult.token.txHash,
          block_timestamp: gqlResult.token.createdAt
        }];

        for (let key in histories) {
          for (let history of histories[key as string]) {
            makeContentsHistoryInsertData(
              contentsHistoryInsertData,
              history,
              key,
            );
          }
        }
        await contentsHistoryModel.createContentsHistories(
          contentsHistoryInsertData,
          gqlResult.token.project.id,
          gqlResult.token.tokenId,
        );
      }
    }

    let result = await contentsHistoryModel.getContentsHistories(
      gqlResult.token.project.id,
      gqlResult.token.tokenId,
      body.pagination.start_num,
      body.pagination.count_num,
    );

    result = makeMemberInfo(result, ['from_', 'to_'], 'member');

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const makeContentsHistoryInsertData = function(
  contentsHistoryInsertData: any[],
  history: {[key: string]: string},
  historyKey: string
) {
  contentsHistoryInsertData.push({
    from_member_id: history.from,
    to_member_id: history.to,
    history_type: history.eventType ?
      `${historyKey.toUpperCase()}_${history.eventType}` :
      `${historyKey.toUpperCase()}`,
    subgraph_raw: history,
    price: history.price,
    tx_hash: historyKey.toUpperCase() === 'OFFERS'?
      history.txHash :
      history.id,
    block_timestamp: history.createdAt,
  });
}

const makeMemberInfo = function(result: any[], prefix: string[], memberResultName: string) {
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < prefix.length; j++) {
      if (result[i][`${prefix[j]}member_id`]) {
        (result[i] as any)[`${prefix[j]}${memberResultName}`] = {
          id: result[i][`${prefix[j]}member_id`],
          username: (result[i] as any)[`${prefix[j]}username`],
          wallet_address: (result[i] as any)[`${prefix[j]}wallet_address`],
          email: (result[i] as any)[`${prefix[j]}email`],
          profile_s3key: (result[i] as any)[`${prefix[j]}profile_s3key`],
          profile_thumbnail_s3key: (result[i] as any)[`${prefix[j]}profile_thumbnail_s3key`],
          created_at: (result[i] as any)[`${prefix[j]}member_created_at`],
          updated_at: (result[i] as any)[`${prefix[j]}member_updated_at`]
        }
      }

      delete (result[i] as any)[`${prefix[j]}member_id`];
      delete (result[i] as any)[`${prefix[j]}username`];
      delete (result[i] as any)[`${prefix[j]}wallet_address`];
      delete (result[i] as any)[`${prefix[j]}email`];
      delete (result[i] as any)[`${prefix[j]}profile_s3key`];
      delete (result[i] as any)[`${prefix[j]}profile_thumbnail_s3key`];
      delete (result[i] as any)[`${prefix[j]}member_created_at`];
      delete (result[i] as any)[`${prefix[j]}member_updated_at`];
    }
  }

  return result
}

const getMemberContentsCandidates = async function(pathParameters: {id: string}, queryStringParameters: PageAndOrderingInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      member_id: parseInt(pathParameters.id),
    }, conn);

    const contentResult = await contentModel.getContentsCandidatesByMember(
      contentModel.member_id,
      queryStringParameters.start_num,
      queryStringParameters.count_num,
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );

    const result = makeMemberInfo(contentResult, [''], 'owner');

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getMemberContentsFavorites = async function(pathParameters: {id: string}, queryStringParameters: PageAndOrderingInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    const contentModel = new Contents({
      member_id: parseInt(pathParameters.id),
    }, conn);

    const contentResult = await contentModel.getContentsFavoritesByMember(
      contentModel.member_id,
      queryStringParameters.start_num,
      queryStringParameters.count_num,
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );

    const result = makeMemberInfo(contentResult, [''], 'owner');

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
  getContent,
	postContent,
  uploadToNftStorageAndUpdateContent,
  patchContent,
  patchContentStatus,
  queryToken,
  queryTokens,
  queryTokensByProject,
  patchContentThumbnailS3key,
  getTobeApprovedContentsInProject,
  getContentVoucherById,
  queryTokensByCreator,
  queryTokensByOwner,
  queryTokenHistory,
  getMemberContentsCandidates,
  getMemberContentsFavorites,
};
import { Contents, Member, Notification, Projects } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { getNftStorageKey } from '../../utils/common/ssmKeys';
import { getS3ObjectInBuffer, getS3ObjectHead, calculateMinusBetweenTowSetsById, isAddress } from '../../utils/common/commonFunc';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
import { PoolClient } from 'pg';
import { S3Client } from '@aws-sdk/client-s3';
import { NFTStorage } from 'nft.storage';
import { File } from '@web-std/file';
import _ from 'lodash';
import { ContentsHistory } from '../../models/contentsHistory/ContentsHistory';
import { PageAndOrderingInfo, PaginationInfo, GqlPageAndOrderingInfo } from './index';
import { Queue } from '../../models/queue/queue';
import { NotificationQueueBody } from '../../models/queue/queue.type';

interface GetContentInfo {
  id: string
  contents_id: string
}
const getContent = async function(pathParameters: GetContentInfo, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    if (!isAddress(pathParameters.id)) {
      const projectModel = new Projects({}, conn);
      const projectResult = await projectModel.getProjectWithAddressOrSlug(pathParameters.id);
      if (!projectResult || !projectResult.address) return {data: {}}
      pathParameters.id = projectResult.address;
    }

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
  const conn: PoolClient = await db.getArtongConnection();

  try {
    // TODO] query policy on every req for now. BEST is to listen event in our server and to syncronize with db
    const policyResult = await graphqlRequest({
      query: 'query Project($id: String) { project(id: $id) { policy } }',
      variables: {id: body.project_address}
    });

    const contentModel = new Contents({
      member_id: member.id,
      project_address: body.project_address,
      content_s3key: body.content_s3key,
      status: policyResult.project.policy === 0 ? 'APPROVED' : undefined,
    }, conn);

    const result = await contentModel.createContent(
      contentModel.member_id,
      contentModel.project_address,
      contentModel.content_s3key,
      contentModel.status,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const uploadToNftStorageAndUpdateContent = async function(body: any, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const client = new S3Client({ region: 'ap-northeast-2' });
    const image = await getS3ObjectInBuffer(client, process.env.S3_BUCKET, body.imageKey);
    const head = await getS3ObjectHead(client, process.env.S3_BUCKET, body.imageKey);

    const fileName = body.imageKey.substring(body.imageKey.lastIndexOf('/') + 1, body.imageKey.length)
    const file = new File([image], fileName, { type: head.ContentType })

    const keys = await getNftStorageKey();
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

    const content = await contentModel._updateContent(
      contentModel.id,
      contentModel.ipfs_url,
      undefined, undefined, undefined,
      contentModel.name,
      contentModel.description,
    );

    const projectModel = new Projects({}, conn)
    const project = await projectModel.getProjectWithAddressOrSlug(content.project_address)
    
    if (project.member_id && member.id && project.member_id !== member.id) {
      const queueModel = new Queue();
  
      const message: NotificationQueueBody= {
        content_id: body.content_id,
        noti_message: `${member.username}님이 ${project.name} 프로젝트에 콘텐츠를 업로드했습니다.`,
        noti_type: 'CONTRIBUTE',
        receiver_id: project.member_id,
        sender_id: member.id,
      }

      queueModel.pubMessage(message)
    }

    return {data: metadata}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchContent = async function(pathParameters: any, body: any, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const contentModel = new Contents({
      id: pathParameters.id,
      ipfs_url: body.ipfs_url,
      token_id: body.tokenId,
      voucher: body.voucher,
      is_redeemed: body.isRedeemed,
      name: body.name,
      description: body.description,
      member_id: member.id,
    }, conn);

    const result = await contentModel.updateContent(
      contentModel.id,
      contentModel.ipfs_url,
      contentModel.token_id,
      contentModel.voucher,
      contentModel.is_redeemed,
      contentModel.name,
      contentModel.description,
      contentModel.member_id,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const patchContentStatus = async function(pathParameters: {id: string, contents_id: string}, body: {status: string}, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

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
    
    if(member.id) {
      const queueModel= new Queue();
      const message:NotificationQueueBody= {
        content_id: result.id!,
        noti_message: `${member.username}님이 ${result.name} 컨텐츠를 승인하였습니다.`,
        noti_type: 'CONTRIBUTE_APPROVE',
        receiver_id: result.member_id!,
        sender_id: member.id,
      }

      queueModel.pubMessage(message)
    }

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface QueryTokenInfo {
  variables: {id: string}
  db: {project_address: string, token_id: number}
}
const queryToken = async function(body: QueryTokenInfo, _db_: string[], pureQuery: string, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    if (!isAddress(body.db.project_address)) {
      const projectModel = new Projects({}, conn);
      const projectResult = await projectModel.getProjectWithAddressOrSlug(body.db.project_address);
      if (!projectResult || !projectResult.address) return {data: {token: {}}}
      body.db.project_address = projectResult.address;
      body.variables.id = projectResult.address + body.db.token_id;
    }

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
    if (!dbResult && !gqlResult.token) {
      return {data: {token: {}}}
    }
    if (!dbResult && gqlResult.token) {
      return {data: {token: {}}} // TODO] db insert needed
    }
    if (dbResult && !gqlResult.token) {
      return {data: {retry: true}}
    }

    if (gqlResult.token.project) {
      gqlResult.token.project['slug'] = (dbResult as any)['slug'];
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

    for (let field of _db_) {
      gqlResult.token[field] = (dbResult as any)[field];
    }

    return {data: gqlResult}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface QueryTokensInfo extends GqlPageAndOrderingInfo {
  idArray: string[]
}
const queryTokens = async function(body: {variables: QueryTokensInfo}, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const gqlResult = await graphqlRequest({
      query: pureQuery,
      variables: body.variables.idArray ?
        body.variables :
        {
          first: body.variables.first + 1,
          skip: body.variables.skip,
          orderBy: body.variables.orderBy,
          orderDirection: body.variables.orderDirection,
        }
    });
    if (gqlResult.tokens.length === 0) {
      return {data: {tokens: []}, meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (gqlResult.tokens.length === body.variables.first + 1) {
      hasMoreData = true;
      gqlResult.tokens.length = body.variables.first;
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
      return {data: {tokens: _.values(merged)}, meta: {hasMoreData: hasMoreData}}
    } else {
      return {data: gqlResult, meta: {hasMoreData: hasMoreData}}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface TokensByProjectInfo extends GqlPageAndOrderingInfo {
  project: string
  start_num: number
}
const queryTokensByProject = async function(body: {variables: TokensByProjectInfo}, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    if (!isAddress(body.variables.project)) {
      const projectModel = new Projects({}, conn);
      const projectResult = await projectModel.getProjectWithAddressOrSlug(body.variables.project);
      if (!projectResult || !projectResult.address) return {data: {tokens:[]}, meta: {subgraph_count: 0, hasMoreData: false}}
      body.variables.project = projectResult.address;
    }

    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});

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

    const contentsResult = await contentModel.getContentsByProject(
      body.variables.project,
      body.variables.start_num,
      body.variables.first + 1,
      body.variables.orderBy,
      body.variables.orderDirection,
    )

    let hasMoreData = false;
    if (contentsResult.length === body.variables.first + 1) {
      hasMoreData = true;
      contentsResult.length = body.variables.first;
    }

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

    return {data: {tokens: result}, meta: {subgraph_count: subgraph_count, hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const patchContentThumbnailS3key = async function(body:any) {
  const conn: PoolClient = await db.getArtongConnection();

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
  const conn: PoolClient = await db.getArtongConnection();

  try {
    if (!isAddress(pathParameters.id)) {
      const projectModel = new Projects({}, conn);
      const projectResult = await projectModel.getProjectWithAddressOrSlug(pathParameters.id);
      if (!projectResult || !projectResult.address) return {data: {}, meta: {hasMoreData: false}}
      pathParameters.id = projectResult.address;
    }

    const contentModel = new Contents({
      project_address: pathParameters.id,
    }, conn);

    let result = await contentModel.getToBeApprovedContents(
      contentModel.project_address,
      parseInt(queryStringParameters.start_num),
      parseInt(queryStringParameters.count_num) + 1,
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );

    let hasMoreData = false;
    if (result.length === parseInt(queryStringParameters.count_num) + 1) {
      hasMoreData = true;
      result.length = parseInt(queryStringParameters.count_num);
    }

    result = makeMemberInfo(result, [''], 'owner');

    return {data: result, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getContentVoucherById = async function(pathParameters: any, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

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

interface TokensByCreatorInfo extends GqlPageAndOrderingInfo {
  creator: string
}
const queryTokensByCreator = async function(body: {variables: TokensByCreatorInfo}, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: {
      first: body.variables.first + 1,
      skip: body.variables.skip,
      creator: body.variables.creator,
      orderBy: body.variables.orderBy,
      orderDirection: body.variables.orderDirection,
    }});
    if (gqlResult.tokens.length === 0) {
      return {data: {tokens: []}, meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (gqlResult.tokens.length === body.variables.first + 1) {
      hasMoreData = true;
      gqlResult.tokens.length = body.variables.first;
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
      return {data: {tokens: _.values(merged)}, meta: {hasMoreData: hasMoreData}}
    } else {
      return {data: gqlResult, meta: {hasMoreData: hasMoreData}}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface TokensByOwnerInfo extends GqlPageAndOrderingInfo {
  owner: string
}
const queryTokensByOwner = async function(body: {variables: TokensByOwnerInfo}, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: {
      first: body.variables.first + 1,
      skip: body.variables.skip,
      owner: body.variables.owner,
      orderBy: body.variables.orderBy,
      orderDirection: body.variables.orderDirection,
    }});
    if (gqlResult.tokens.length === 0) {
      return {data: {tokens: []}, meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (gqlResult.tokens.length === body.variables.first + 1) {
      hasMoreData = true;
      gqlResult.tokens.length = body.variables.first;
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
      return {data: {tokens: _.values(merged)}, meta: {hasMoreData: hasMoreData}}
    } else {
      return {data: gqlResult, meta: {hasMoreData: hasMoreData}}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface QueryTokenHistoryInfo {
  variables: {
    id: string
    project_address: string
    token_id: string
  }
  pagination: PaginationInfo
}
const queryTokenHistory = async function(body: QueryTokenHistoryInfo, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    if (!isAddress(body.variables.project_address)) {
      const projectModel = new Projects({}, conn);
      const projectResult = await projectModel.getProjectWithAddressOrSlug(body.variables.project_address);
      if (!projectResult || !projectResult.address) return {data: {token: {}}, meta: {hasMoreData: false}}
      body.variables.project_address = projectResult.address;
      body.variables.id = projectResult.address + body.variables.token_id;
    }

    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (!gqlResult.token) {
      return {data: {token: {}}, meta: {hasMoreData: false}}
    }

    const contentsHistoryModel = new ContentsHistory({}, conn);

    if (parseInt(body.pagination.start_num) === 0) {
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
      parseInt(body.pagination.start_num),
      parseInt(body.pagination.count_num) + 1,
    );

    let hasMoreData = false;
    if (result.length === parseInt(body.pagination.count_num) + 1) {
      hasMoreData = true;
      result.length = parseInt(body.pagination.count_num);
    }

    result = makeMemberInfo(result, ['from_', 'to_'], 'member');

    return {data: result, meta: {hasMoreData: hasMoreData}}
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

const getMemberContentsCandidates = async function(pathParameters: {id: string}, queryStringParameters: PageAndOrderingInfo, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const contentModel = new Contents({
      member_id: parseInt(pathParameters.id),
    }, conn);

    const contentResult = await contentModel.getContentsCandidatesByMember(
      contentModel.member_id,
      contentModel.member_id === member.id,
      parseInt(queryStringParameters.start_num),
      parseInt(queryStringParameters.count_num) + 1,
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );

    let hasMoreData = false;
    if (contentResult.length === parseInt(queryStringParameters.count_num) + 1) {
      hasMoreData = true;
      contentResult.length = parseInt(queryStringParameters.count_num);
    }

    const result = makeMemberInfo(contentResult, [''], 'owner');

    return {data: result, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getMemberFavoritedContents = async function(pathParameters: {id: string}, queryStringParameters: PageAndOrderingInfo) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const contentModel = new Contents({
      member_id: parseInt(pathParameters.id),
    }, conn);

    let contentResult = await contentModel.getFavoritedContentsByMember(
      contentModel.member_id,
      parseInt(queryStringParameters.start_num),
      parseInt(queryStringParameters.count_num) + 1,
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );
    if (contentResult.length === 0) {
      return {data: [], meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (contentResult.length === parseInt(queryStringParameters.count_num) + 1) {
      hasMoreData = true;
      contentResult.length = parseInt(queryStringParameters.count_num);
    }

    const extractedConcatenatedTokenIds = contentResult.reduce((acc, content) => {
      if (content.project_address && content.token_id) {
        acc.push(content.project_address.concat(content.token_id.toString()))
      }
      return acc
    }, [] as any);

    if (extractedConcatenatedTokenIds.length > 0) {
      const gqlResult = await graphqlRequest({
        query: `query Tokens { tokens(where: {id_in: ${JSON.stringify(extractedConcatenatedTokenIds)}}) {
          id,
          owner,
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
        }}`,
      });

      if (gqlResult.tokens.length > 0) {
        const extractedOwners = gqlResult.tokens.reduce((acc: any, value: any) => {
          if (!acc[value.owner]) {
            acc[value.owner] = value.owner
          }
          return acc
        }, {});

        const memberModel = new Member({}, conn);
        const memberResult = await memberModel.getMembersWithWalletAddressArray(Object.keys(extractedOwners));

        const merged = _.map(gqlResult.tokens, function(token) {
          return _.assign(token, _.find(memberResult, {
              wallet_address: token.owner
          }));
        });
        const mergedWithOwner = makeMemberInfo(merged, [''], 'owner');

        contentResult = _.map(contentResult, function(content) {
          if (content.project_address && content.token_id) {
            return _.assign(content, _.find(mergedWithOwner, {
              id: content.project_address.concat(content.token_id.toString())
            }));
          } else {
            return content
          }
        });
      }
    }

    contentResult = makeMemberInfo(contentResult, [''], 'creator');

    return {data: contentResult, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getFeedContents = async function(queryStringParameters: PageAndOrderingInfo, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const contentModel = new Contents({}, conn);

    let contentResult = await contentModel.getFeedContents(
      member.id,
      parseInt(queryStringParameters.count_num) + 1,
      parseInt(queryStringParameters.start_num),
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );
    if (contentResult.length === 0) {
      return {data: [], meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (contentResult.length === parseInt(queryStringParameters.count_num) + 1) {
      hasMoreData = true;
      contentResult.length = parseInt(queryStringParameters.count_num);
    }

    const extractedConcatenatedTokenIds = contentResult.reduce((acc, content) => {
      if (content.project_address && content.token_id) {
        acc.push(content.project_address.concat(content.token_id.toString()))
      }
      return acc
    }, [] as any);

    if (extractedConcatenatedTokenIds.length > 0) {
      const gqlResult = await graphqlRequest({
        query: `query Tokens { tokens(where: {id_in: ${JSON.stringify(extractedConcatenatedTokenIds)}}) {
          id,
          owner,
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
        }}`,
      });

      if (gqlResult.tokens.length > 0) {
        const extractedOwners = gqlResult.tokens.reduce((acc: any, value: any) => {
          if (!acc[value.owner]) {
            acc[value.owner] = value.owner
          }
          return acc
        }, {});

        const memberModel = new Member({}, conn);
        const memberResult = await memberModel.getMembersWithWalletAddressArray(Object.keys(extractedOwners));

        const merged = _.map(gqlResult.tokens, function(token) {
          return _.assign(token, _.find(memberResult, {
              wallet_address: token.owner
          }));
        });
        const mergedWithOwner = makeMemberInfo(merged, [''], 'owner');

        contentResult = _.map(contentResult, function(content) {
          if (content.project_address && content.token_id) {
            return _.assign(content, _.find(mergedWithOwner, {
              id: content.project_address.concat(content.token_id.toString())
            }));
          } else {
            return content
          }
        });
      }
    }

    contentResult = makeMemberInfo(contentResult, [''], 'creator');

    return {data: contentResult, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getContents = async function(queryStringParameters: PageAndOrderingInfo) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const contentModel = new Contents({}, conn);

    let contentResult = await contentModel.getContents(
      parseInt(queryStringParameters.count_num) + 1,
      parseInt(queryStringParameters.start_num),
      queryStringParameters.order_by,
      queryStringParameters.order_direction,
    );
    if (contentResult.length === 0) {
      return {data: [], meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (contentResult.length === parseInt(queryStringParameters.count_num) + 1) {
      hasMoreData = true;
      contentResult.length = parseInt(queryStringParameters.count_num);
    }

    const extractedConcatenatedTokenIds = contentResult.reduce((acc, content) => {
      if (content.project_address && content.token_id) {
        acc.push(content.project_address.concat(content.token_id.toString()))
      }
      return acc
    }, [] as any);

    if (extractedConcatenatedTokenIds.length > 0) {
      const gqlResult = await graphqlRequest({
        query: `query Tokens { tokens(where: {id_in: ${JSON.stringify(extractedConcatenatedTokenIds)}}) {
          id,
          owner,
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
        }}`,
      });

      if (gqlResult.tokens.length > 0) {
        const extractedOwners = gqlResult.tokens.reduce((acc: any, value: any) => {
          if (!acc[value.owner]) {
            acc[value.owner] = value.owner
          }
          return acc
        }, {});

        const memberModel = new Member({}, conn);
        const memberResult = await memberModel.getMembersWithWalletAddressArray(Object.keys(extractedOwners));

        const merged = _.map(gqlResult.tokens, function(token) {
          return _.assign(token, _.find(memberResult, {
              wallet_address: token.owner
          }));
        });
        const mergedWithOwner = makeMemberInfo(merged, [''], 'owner');

        contentResult = _.map(contentResult, function(content) {
          if (content.project_address && content.token_id) {
            return _.assign(content, _.find(mergedWithOwner, {
              id: content.project_address.concat(content.token_id.toString())
            }));
          } else {
            return content
          }
        });
      }
    }

    contentResult = makeMemberInfo(contentResult, [''], 'creator');

    return {data: contentResult, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getContentsPick = async function(body: {ids: number[]}) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const contentModel = new Contents({}, conn);

    let contentResult = await contentModel.getContentsWithIdArray(
      body.ids,
    );
    if (contentResult.length === 0) {
      return {data: [], meta: {hasMoreData: false}}
    }

    const extractedConcatenatedTokenIds = contentResult.reduce((acc, content) => {
      if (content.project_address && content.token_id) {
        acc.push(content.project_address.concat(content.token_id.toString()))
      }
      return acc
    }, [] as any);

    if (extractedConcatenatedTokenIds.length > 0) {
      const gqlResult = await graphqlRequest({
        query: `query Tokens { tokens(where: {id_in: ${JSON.stringify(extractedConcatenatedTokenIds)}}) {
          id,
          owner,
          listings (orderBy: createdAt, orderDirection: desc, first: 1) {
            id
            from
            price
            eventType
            createdAt
          }
        }}`,
      });

      if (gqlResult.tokens.length > 0) {
        const extractedOwners = gqlResult.tokens.reduce((acc: any, value: any) => {
          if (!acc[value.owner]) {
            acc[value.owner] = value.owner
          }
          return acc
        }, {});

        const memberModel = new Member({}, conn);
        const memberResult = await memberModel.getMembersWithWalletAddressArray(Object.keys(extractedOwners));

        const merged = _.map(gqlResult.tokens, function(token) {
          return _.assign(token, _.find(memberResult, {
              wallet_address: token.owner
          }));
        });
        const mergedWithOwner = makeMemberInfo(merged, [''], 'owner');

        contentResult = _.map(contentResult, function(content) {
          if (content.project_address && content.token_id) {
            return _.assign(content, _.find(mergedWithOwner, {
              id: content.project_address.concat(content.token_id.toString())
            }));
          } else {
            return content
          }
        });
      }
    }

    contentResult = makeMemberInfo(contentResult, [''], 'creator');

    return {data: contentResult, meta: {hasMoreData: false}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

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
  getMemberFavoritedContents,
  getFeedContents,
  getContents,
  getContentsPick,
};
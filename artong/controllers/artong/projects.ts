import { Projects, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { InfuraProvider } from '../../contracts';
import * as db from '../../utils/db/db';
import { PoolClient } from 'pg';
import { ethers } from 'ethers';
import _ from 'lodash';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
import { calculateMinusBetweenTowSetsById, isAddress } from '../../utils/common/commonFunc'
import { PaginationInfo, GqlPageAndOrderingInfo } from './index';
import validator from '../../utils/validators/common';
import { getInfuraKey } from '../../utils/common/ssmKeys';
import { InternalServerError } from '../../utils/error/errors';
import { AWSError } from '../../utils/error/errorCodes';

interface GetProjectsInfo {
  prev_next_count: number
  basis_project_address: string
}
const getProjectsPrevNext = async function(queryStringParameters: GetProjectsInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    if (!isAddress(queryStringParameters.basis_project_address)) {
      const projectModel = new Projects({}, conn);
      const projectResult = await projectModel.getProjectWithAddressOrSlug(queryStringParameters.basis_project_address);
      if (!projectResult || !projectResult.address) return {data: {}}
      queryStringParameters.basis_project_address = projectResult.address;
    }

    const projectModel = new Projects({
      address: queryStringParameters.basis_project_address
    }, conn)

    const result = await projectModel.getProjectsPrevNext(
      projectModel.address,
      queryStringParameters.prev_next_count,
    );

    const extractedProjectIds = result.map((project: Projects) => project.address) as string[];

    if (extractedProjectIds.length > 0) {
      const memberModel = new Member({}, conn);
      const contributorsResult = await memberModel.getTopContributorsInProjects(extractedProjectIds);

      if (contributorsResult.length > 0) {
        const contributorsArrayGroupByProjectAddress = _.groupBy(contributorsResult as any[], c => c.project_address);
        for (let project of result) {
          if (contributorsArrayGroupByProjectAddress[project.address as string]) {
            contributorsArrayGroupByProjectAddress[project.address as string].splice(5)
          }
          (project as any).contributors = contributorsArrayGroupByProjectAddress[project.address as string] || [];
        }
      }
    }

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

interface PostProjectInfo {
  create_tx_hash: string
  name: string
  symbol: string
  status: string
  project_s3key: string
  background_s3key: string
}
const postProject = async function(body: PostProjectInfo, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: body.create_tx_hash,
      member_id: member.id,
      name: body.name,
      symbol: body.symbol,
      status: body.status || 'PENDING',
      project_s3key: body.project_s3key,
      background_s3key: body.background_s3key,
    }, conn);

    const result = await projectModel.createProject(
      projectModel.create_tx_hash,
      projectModel.member_id,
      projectModel.name,
      projectModel.symbol,
      projectModel.status,
      projectModel.project_s3key,
      projectModel.background_s3key,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchProject = async function(pathParameters: { id: string }, body: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: pathParameters.id,
      address: body.address,
      member_id: member.id,
      description: body.description,
      project_s3key: body.project_s3key,
      background_s3key: body.background_s3key,
      status: body.status,
      sns: body.sns,
      slug: body.slug ? body.slug : null,
    }, conn);

    await validator(projectModel);

    const result = await projectModel.updateProject(
      projectModel.create_tx_hash,
      projectModel.address,
      projectModel.member_id,
      projectModel.description,
      projectModel.project_s3key,
      projectModel.background_s3key,
      projectModel.status,
      projectModel.sns,
      projectModel.slug,
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getProjectWhileUpdatingPendingToCreated = async function(pathParameters: { id: string }, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: pathParameters.id
    }, conn);

    const result = await projectModel.getProjectWithTxhash(
      projectModel.create_tx_hash
    );

    if (result && result.status === 'PENDING') {
      const result = await getTxReceiptAndUpdateStatus(
        member.id,
        projectModel.create_tx_hash
      );
      return {data: result}
    }

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

const getTxReceiptAndUpdateStatus = async function(member_id?: number, txHash?: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: txHash
    }, conn);

    const infuraKeys = await getInfuraKey();
    if (!infuraKeys) throw new InternalServerError('SSM key error', AWSError);

    const infuraProvider = new InfuraProvider(infuraKeys[`/infura/${process.env.ENV}/key`]);
    const txReceipt = await infuraProvider.provider.getTransactionReceipt(txHash);
    if (txReceipt) {
      const address = getProjectAddressFromContractCreatedEvent(txReceipt);

      projectModel.address = address;
      projectModel.status = 'CREATED';

      const result = await projectModel.updateProjectAddressAndStatus(
        projectModel.create_tx_hash,
        projectModel.address,
        projectModel.status
      );

      return result
    }
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

const getProjectAddressFromContractCreatedEvent = function(txReceipt: any) {
  const resultArray = txReceipt.logs.map((evt: any) => {
    if (
      evt.topics[0] ===
      '0x3a7b4f8ec4c999d5e111169052be6ed6d3043552a3319cba2c6fb1818e1c13ac' // INFO] Event: ContractCreated
    ) {
      const address = ethers.utils.hexDataSlice(evt.data, 44, 64)
      return address
    }
  })

  for (let i = 0; i < resultArray.length; i++) {
    const isAddressExists = resultArray[i]
    if (isAddressExists) {
      return resultArray[i]
    }
  }
}

const queryProject = async function(body: any, _db_: string[], pureQuery: string, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({}, conn);
    const dbResult = await projectModel.getProjectWithAddressOrSlug(
      body.variables.id,
      member.id
    );
    if (!dbResult) {
      return {data: {project: {}}}
    } else {
      body.variables.id = dbResult.address;
    }

    const gqlResult = await graphqlRequest({query: pureQuery, variables: { id: body.variables.id }});

    if (!gqlResult.project) {
      return {data: {retry: true}}
    }

    const memberModel = new Member({}, conn);
    const ownerResult = await memberModel.getMembersWithWalletAddressArray([gqlResult.project.owner]);
    if (ownerResult.length === 1) {
      gqlResult.project.owner = ownerResult[0];
    }

    const contributorsResult = await memberModel.getTop5ContributorsInProject(body.variables.id);
    if (contributorsResult.length > 0) {
      gqlResult.project.contributors = contributorsResult;
    } else {
      gqlResult.project.contributors = [];
    }

    for (let field of _db_) {
      gqlResult.project[field] = (dbResult as any)[field];
    }

    return {data: gqlResult}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface QueryProjectsInfo extends GqlPageAndOrderingInfo {
  idArray: string[]
}
const queryProjects = async function(body: {variables: QueryProjectsInfo}, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

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
    if (gqlResult.projects.length === 0) {
      return {data: {projects: []}, meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (gqlResult.projects.length === body.variables.first + 1) {
      hasMoreData = true;
      gqlResult.projects.length = body.variables.first;
    }

    const extractedProjectIds = gqlResult.projects.map((project: { id: string; }) => project.id);
    const extractedCreateTxHashes = gqlResult.projects.map((project: { txHash: string; }) => project.txHash);

    const projectModel = new Projects({}, conn);
    let projectResult = await projectModel.getProjectsWithTxHashArray(extractedCreateTxHashes, _db_);
    projectResult = await getProjectArrayWithStatusUpdatesFromTxReceipts(projectResult);

    if (projectResult.length < gqlResult.projects.length) {
      const projects = calculateMinusBetweenTowSetsById(gqlResult.projects, projectResult as any);
      await projectModel.createProjects(projects);
      projectResult = await projectModel.getProjectsWithAddressArray(extractedProjectIds, _db_);
    }

    let result = null;

    if (projectResult.length > 0) {
      const merged = _.merge(_.keyBy(gqlResult.projects, 'txHash'), _.keyBy(projectResult, 'create_tx_hash'));
      result = {projects: _.values(merged)};
    } else {
      result = gqlResult;
    }

    if (extractedProjectIds.length > 0) {
      const memberModel = new Member({}, conn);
      const contributorsResult = await memberModel.getTopContributorsInProjects(extractedProjectIds);

      if (contributorsResult.length > 0) {
        const contributorsArrayGroupByProjectAddress = _.groupBy(contributorsResult as any[], c => c.project_address);
        for (let index in result.projects) {
          if (contributorsArrayGroupByProjectAddress[result.projects[index].id]) {
            contributorsArrayGroupByProjectAddress[result.projects[index].id].splice(5)
          }
          result.projects[index].contributors = contributorsArrayGroupByProjectAddress[result.projects[index].id] || [];
        }
      }
    }

    return {data: result, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface ProjectsByCreatorInfo extends GqlPageAndOrderingInfo {
  creator: string
}
const queryProjectsByCreator = async function(body: {variables: ProjectsByCreatorInfo}, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: {
      first: body.variables.first + 1,
      skip: body.variables.skip,
      orderBy: body.variables.orderBy,
      orderDirection: body.variables.orderDirection,
      creator: body.variables.creator,
    }});
    if (gqlResult.projects.length === 0) {
      return {data: {projects: []}, meta: {hasMoreData: false}}
    }

    let hasMoreData = false;
    if (gqlResult.projects.length === body.variables.first + 1) {
      hasMoreData = true;
      gqlResult.projects.length = body.variables.first;
    }

    const extractedProjectIds = gqlResult.projects.map((project: { id: string; }) => project.id);
    const extractedCreateTxHashes = gqlResult.projects.map((project: { txHash: string; }) => project.txHash);

    let projectResult = [];
    const projectModel = new Projects({}, conn);

    projectResult = await projectModel.getProjectsByCreatorWithTxHashArray(
      extractedCreateTxHashes,
      body.variables.creator,
      _db_
    );
    projectResult = await getProjectArrayWithStatusUpdatesFromTxReceipts(projectResult);

    if (projectResult.length < gqlResult.projects.length) {
      const projects = calculateMinusBetweenTowSetsById(gqlResult.projects, projectResult as any);
      await projectModel.createProjects(projects);
      projectResult = await projectModel.getProjectsByCreatorWithAddressArray(
        extractedProjectIds,
        body.variables.creator,
        _db_
      );
    }

    let result = null;

    if (projectResult.length > 0) {
      const merged = _.merge(_.keyBy(gqlResult.projects, 'txHash'), _.keyBy(projectResult, 'create_tx_hash'))
      result = {projects: _.values(merged)};
    } else {
      result = gqlResult
    }

    if (extractedProjectIds.length > 0) {
      const memberModel = new Member({}, conn);
      const contributorsResult = await memberModel.getTopContributorsInProjects(extractedProjectIds);

      if (contributorsResult.length > 0) {
        const contributorsArrayGroupByProjectAddress = _.groupBy(contributorsResult as any[], c => c.project_address);
        for (let index in result.projects) {
          if (contributorsArrayGroupByProjectAddress[result.projects[index].id]) {
            contributorsArrayGroupByProjectAddress[result.projects[index].id].splice(5)
          }
          result.projects[index].contributors = contributorsArrayGroupByProjectAddress[result.projects[index].id] || [];
        }
      }
    }

    return {data: result, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getProjectArrayWithStatusUpdatesFromTxReceipts = async function(projects: Projects[]) {
  try {
    let updatedProjects = await getTxReceiptsAndUpdateStatus(projects);
    updatedProjects = updatedProjects.filter(element => {
      return element !== undefined;
    });

    if (updatedProjects.length > 0) {
      const merged = _.merge(_.keyBy(projects, 'create_tx_hash'), _.keyBy(updatedProjects, 'create_tx_hash'));
      projects =  _.values(merged);
    }

    return projects
  } catch (error) {
    throw controllerErrorWrapper(error);
  }
}

const getTxReceiptsAndUpdateStatus = async function(projectArray: Projects[]): Promise<Projects[]> {
  const pendingInfo = projectArray.reduce((acc, project) => {
    if (project.status === 'PENDING') {
      acc.push({
        func: getTxReceiptAndUpdateStatus,
        params: {member_id: project.member_id, txHash: project.create_tx_hash}
      });
    }
    return acc;
  }, [] as any);

  if (pendingInfo.length > 0) {
    return await Promise.all(pendingInfo.map((obj: any) => {
      return obj.func(obj.params.member_id, obj.params.txHash);
    }));
  }
  return []
}

const getMemberSubscribedProjects = async function(pathParameters: { id: string }, queryStringParameters: PaginationInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      member_id: parseInt(pathParameters.id),
    }, conn);

    const result = await projectModel.getMemberSubscribedProjects(
      projectModel.member_id,
      parseInt(queryStringParameters.start_num),
      parseInt(queryStringParameters.count_num) + 1,
    );

    let hasMoreData = false;
    if (result.length === parseInt(queryStringParameters.count_num) + 1) {
      hasMoreData = true;
      result.length = parseInt(queryStringParameters.count_num);
    }

    return {data: result, meta: {hasMoreData: hasMoreData}}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

interface PatchProjectThumbnailS3keyInfo {
  project_s3key: string
  project_thumbnail_s3key: string
  background_s3key: string
  background_thumbnail_s3key: string
}
const patchProjectThumbnailS3key = async function(body: PatchProjectThumbnailS3keyInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      project_s3key: body.project_s3key,
      project_thumbnail_s3key: body.project_thumbnail_s3key,
      background_s3key: body.background_s3key,
      background_thumbnail_s3key: body.background_thumbnail_s3key,
    }, conn);

    const result = await projectModel.updateProjectThumbnailS3keys(
      projectModel.project_s3key,
      projectModel.project_thumbnail_s3key,
      projectModel.background_s3key,
      projectModel.background_thumbnail_s3key,
    );

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
  getProjectsPrevNext,
	postProject,
  patchProject,
  getProjectWhileUpdatingPendingToCreated,
  queryProject,
  queryProjects,
  queryProjectsByCreator,
  getMemberSubscribedProjects,
  patchProjectThumbnailS3key,
};
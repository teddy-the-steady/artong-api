import { Projects, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { InfuraProvider, abi } from '../../contracts';
import * as db from '../../utils/db/db';
import { PoolClient } from 'pg';
import { ethers } from 'ethers';
import _ from 'lodash';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
import { paginationInfo } from './index';

interface getProjectsInfo extends paginationInfo {
  member_id: number
  status: string
}
const getProjects = async function(queryStringParameters: getProjectsInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      member_id: queryStringParameters.member_id,
      status: queryStringParameters.status
    }, conn)

    const result = await projectModel.getProjects(
      projectModel.member_id,
      projectModel.status,
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

const postProject = async function(body: any, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: body.create_tx_hash,
      member_id: member.id,
      name: body.name,
      symbol: body.symbol,
      status: body.status || 'PENDING'
    }, conn);

    const result = await projectModel.createProject(
      projectModel.create_tx_hash,
      projectModel.member_id,
      projectModel.name,
      projectModel.symbol,
      projectModel.status
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
      status: body.status
    }, conn);

    const result = await projectModel.updateProject(
      projectModel.create_tx_hash,
      projectModel.address,
      projectModel.member_id,
      projectModel.description,
      projectModel.project_s3key,
      projectModel.background_s3key,
      projectModel.status
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

    const txReceipt = await InfuraProvider.provider.getTransactionReceipt(txHash);
    if (txReceipt) {
      const address = getProjectAddressFromContractCreatedEvent(txReceipt);

      projectModel.address = address;
      projectModel.member_id = member_id;
      projectModel.status = 'CREATED';

      const result = await projectModel.updateProject(
        projectModel.create_tx_hash,
        projectModel.address,
        projectModel.member_id,
        projectModel.description,
        projectModel.project_s3key,
        projectModel.background_s3key,
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

const queryProject = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({ address: body.variables.id }, conn);

    const [dbResult, gqlResult] = await Promise.all([
      projectModel.getProjectWithAddress(projectModel.address),
      graphqlRequest({query: pureQuery, variables: body.variables})
    ]);

    if (dbResult && gqlResult.project) {
      for (let field of _db_) {
        gqlResult.project[field] = (dbResult as any)[field];
      }
    } else {
      return {data: {project: {}}}
    }

    return {data: gqlResult}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const queryProjects = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.projects.length === 0) {
      return {data: {projects: []}}
    }

    const projectModel = new Projects({}, conn);
    const extractedProjectIds = gqlResult.projects.map((project: { id: string; }) => project.id);

    const dbResult = await projectModel.getProjectsWithAddressArray(extractedProjectIds, _db_);

    if (dbResult && gqlResult.projects) {
      const merged = _.merge(_.keyBy(gqlResult.projects, 'id'), _.keyBy(dbResult, 'id'))
      return {data: {projects: _.values(merged)}}
    } else {
      return {data: gqlResult}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const queryProjectsByCreator = async function(body: any, _db_: string[], pureQuery: string, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    if (member.wallet_address === body.variables.creator) {
      const result = await queryProjectsWhenCreatorEqualsMember(body, _db_, member);
      return {data: {projects: result}}
    }

    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.projects.length === 0) {
      return {data: {projects: []}}
    }

    const projectModel = new Projects({
      address: body.variables.creator
    }, conn);
    const extractedProjectIds = gqlResult.projects.map((project: { id: string; }) => project.id);

    const dbResult = await projectModel.getProjectsByCreatorWithAddressArray(
      extractedProjectIds,
      projectModel.address,
      _db_
    );

    if (dbResult && gqlResult.projects) {
      const merged = _.merge(_.keyBy(gqlResult.projects, 'id'), _.keyBy(dbResult, 'id'))
      return {data: {projects: _.values(merged)}}
    } else {
      return {data: gqlResult}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const queryProjectsWhenCreatorEqualsMember = async function(body: any, _db_: string[], member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({ member_id: member.id }, conn);
    let projects = await projectModel.getProjects(
      projectModel.member_id,
      projectModel.status,
      body.variables.skip,
      body.variables.first,
    );

    let updatedProjects = await getTxReceiptsAndUpdateStatusForProjectArray(projects);
    updatedProjects = updatedProjects.filter(element => {
      return element !== undefined;
    });

    if (updatedProjects.length > 0) {
      const merged = _.merge(_.keyBy(projects, 'create_tx_hash'), _.keyBy(updatedProjects, 'create_tx_hash'));
      projects =  _.values(merged);
    }

    const extractedProjectIds = projects.reduce((acc, Projects: Projects) => {
      if (Projects && Projects.address) {
        acc.push(Projects.address);
      }
      return acc;
    }, [] as any);

    delete body.variables.first;
    delete body.variables.skip;
    body.variables.ids = extractedProjectIds;

    const gqlResult = await graphqlRequest({query: `
      query ProjectsByCreator($creator: String, $ids: [String]) {
        projects(where: {creator: $creator, id_in: $ids}) {
          id
          creator
          owner
          name
          symbol
          maxAmount
          policy
          isDisabled
          createdAt
          updatedAt
        }
      }
    `, variables: body.variables});

    const merged2 = _.merge(_.keyBy(projects, 'address'), _.keyBy(gqlResult.projects, 'id'));
    const result =  _.values(merged2);

    return  result
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getTxReceiptsAndUpdateStatusForProjectArray = async function(projectArray: Projects[]): Promise<Projects[]> {
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
    return await Promise.all(pendingInfo.map(async (obj: any) => {
      return await obj.func(obj.params.member_id, obj.params.txHash);
    }));
  }
  return []
}

const getMemberSubscribedProjects = async function(pathParameters: { id: string }, queryStringParameters: paginationInfo) {
  const conn: PoolClient = await db.getConnection();

  try {
    const projectModel = new Projects({
      member_id: parseInt(pathParameters.id),
    }, conn);

    const result = await projectModel.getMemberSubscribedProjects(
      projectModel.member_id,
      queryStringParameters.start_num,
      queryStringParameters.count_num,
    );

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
  getProjects,
	postProject,
  patchProject,
  getProjectWhileUpdatingPendingToCreated,
  queryProject,
  queryProjects,
  queryProjectsByCreator,
  getMemberSubscribedProjects,
};
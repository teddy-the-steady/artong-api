import { Projects, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import InfuraProvider from '../../utils/common/InfuraProvider';
import * as db from '../../utils/db/db';
import { Client } from 'pg';
import { ethers } from 'ethers';

const postProject = async function(body: any, member: Member) {
  const conn: Client = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: body.create_tx_hash,
      member_id: member.id,
      name: body.name,
      symbol: body.symbol,
      status: body.status
    }, conn);

    const result = await projectModel.createProject(
      projectModel.create_tx_hash,
      projectModel.member_id,
      projectModel.name,
      projectModel.symbol,
      projectModel.status
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchProject = async function(pathParameters: any, body: any, member: Member) {
  const conn: Client = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: pathParameters.txHash,
      address: body.address,
      member_id: member.id,
      description: body.description,
      thumbnail_url: body.thumbnail_url,
      background_url: body.background_url,
      status: body.status
    }, conn);

    const result = await projectModel.updateProject(
      projectModel.create_tx_hash,
      projectModel.address,
      projectModel.member_id,
      projectModel.description,
      projectModel.thumbnail_url,
      projectModel.background_url,
      projectModel.status
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const getProjectWhileUpdatingCreatedPendingOne = async function(pathParameters: any, member: any) {
  const conn: Client = await db.getConnection();

  try {
    const projectModel = new Projects({
      create_tx_hash: pathParameters.txHash
    }, conn);

    const result = await projectModel.getProject(
      projectModel.create_tx_hash
    );

    if (result && result.status === 'PENDING') {
      const txReceipt = await InfuraProvider.provider.getTransactionReceipt(pathParameters.txHash);
      if (txReceipt) {
        const address = getProjectAddressFromContractCreatedEvent(txReceipt);

        projectModel.address = address;
        projectModel.member_id = member.id;
        projectModel.status = 'CREATED';

        const result = await projectModel.updateProject(
          projectModel.create_tx_hash,
          projectModel.address,
          projectModel.member_id,
          projectModel.description,
          projectModel.thumbnail_url,
          projectModel.background_url,
          projectModel.status
        );

        return {'data': result}
      } else {
        return {'data': result}
      }
    }

    return {'data': result}
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
      '0x2d49c67975aadd2d389580b368cfff5b49965b0bd5da33c144922ce01e7a4d7b' // Event: ContractCreated
    ) {
      const address = ethers.utils.hexDataSlice(evt.data, 44)
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

export {
	postProject,
  patchProject,
  getProjectWhileUpdatingCreatedPendingOne,
};
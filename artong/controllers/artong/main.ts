import { PoolClient } from 'pg';
import { Member } from '../../models/index';
import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';

const getTop10Contributors = async function() {
  const conn: PoolClient = await db.getConnection();

  try {
    const memberModel = new Member({}, conn);

    const result = await memberModel.getTop10Contributors();
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

const getMainContents = function() {
  const result = {
    mainToken: {
      project_address: '0x1dfb68c77a7ef6a8a2ff5488844553b6134f9b67',
      token_id: '1'
    },
    highlightedProjects: [
      '0x1dfb68c77a7ef6a8a2ff5488844553b6134f9b67',
      '0xeacab63bb8b8aa1a9ffb7b7040b32132133f0f92',
      '0x289f3a6d113ea55ea81f121c802dc7ca7c9455a7',
      '0x9579daec07b696ffcd0b36e62266684aec9d02e8',
      '0xc50622bfebf35ad374eda660b47d2b91c911439c',
      '0xf86cd8128025545ea113ec2440ee023a286f5320',
    ],
    artongsPick: [892, 895, 884, 903, 922, 1099, 1125, 1177]
  }
  return {data: result}
};

export {
  getTop10Contributors,
  getMainContents,
};
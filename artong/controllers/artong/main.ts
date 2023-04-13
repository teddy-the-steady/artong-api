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
      project_address: '0x289f3a6d113ea55ea81f121c802dc7ca7c9455a7',
      token_id: '1'
    },
    highlightedProjects: [
      '0x289f3a6d113ea55ea81f121c802dc7ca7c9455a7',
      '0x9579daec07b696ffcd0b36e62266684aec9d02e8',
    ],
    artongsPick: [895, 894, 861, 892, 899, 884]
  }
  return {data: result}
};

export {
  getTop10Contributors,
  getMainContents,
};
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
      project_address: '0x9579daec07b696ffcd0b36e62266684aec9d02e8',
      token_id: '1'
    },
    highlightedProjects: [
      '0x9579daec07b696ffcd0b36e62266684aec9d02e8',
    ],
    artongsPick: [
      '0x9579daec07b696ffcd0b36e62266684aec9d02e81',
    ]
  }
  return {data: result}
};

export {
  getTop10Contributors,
  getMainContents,
};
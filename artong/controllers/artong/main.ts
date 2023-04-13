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
      project_address: '0xeb629c752200c6a58947b7887e3a1e9beb0245f1',
      token_id: '2'
    },
    highlightedProjects: [
      '0xeb629c752200c6a58947b7887e3a1e9beb0245f1',
      '0x31739f4598411143b279cd0b6cb714a360b90178',
      '0x0ff3495df6131426bc6bc28397459ff13113157e',
      '0x90b8bbf892a205cd9ac774e9d910a68c42bfced5',
    ],
    artongsPick: [936,937,960]
  }
  return {data: result}
};

export {
  getTop10Contributors,
  getMainContents,
};
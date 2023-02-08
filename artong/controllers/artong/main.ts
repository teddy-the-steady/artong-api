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
      project_address: '0xffcc9cbf76ddbb240ba8e614e10f3863ba10a8e4',
      token_id: '1'
    },
    highlightedProjects: [
      '0xffcc9cbf76ddbb240ba8e614e10f3863ba10a8e4',
      '0x9c202218148cfdff5e1e18f0c6a30d011de5c1ac',
      '0x52234011cf229f16bbd2ff191c2627275de87870',
      '0x6b426ca2327c72089d192bbf3eb43abfc438975d',
      '0x0670eec8053e401c4bb5e89fb70be8508f01a054',
    ],
    artongsPick: [
      '0x0670eec8053e401c4bb5e89fb70be8508f01a0541',
      '0xffcc9cbf76ddbb240ba8e614e10f3863ba10a8e41',
      '0x6b426ca2327c72089d192bbf3eb43abfc438975d1',
      '0xffcc9cbf76ddbb240ba8e614e10f3863ba10a8e42',
    ]
  }
  return {data: result}
};

export {
  getTop10Contributors,
  getMainContents,
};
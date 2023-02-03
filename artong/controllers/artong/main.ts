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
      project_address: '0xd9416da54de8b9cf356899834e71b1494e822952',
      token_id: '6'
    },
    highlightedProjects: [
      '0xd9416da54de8b9cf356899834e71b1494e822952',
      '0x14776dc107625db2580d90c6282f0663b5299fd1',
    ],
    artongsPick: [
      '0x14776dc107625db2580d90c6282f0663b5299fd17',
      '0xd9416da54de8b9cf356899834e71b1494e8229525',
      '0x14776dc107625db2580d90c6282f0663b5299fd11',
      '0xd9416da54de8b9cf356899834e71b1494e8229528',
      '0x14776dc107625db2580d90c6282f0663b5299fd15',
      '0xd9416da54de8b9cf356899834e71b1494e8229529',
      '0x14776dc107625db2580d90c6282f0663b5299fd12',
      '0xd9416da54de8b9cf356899834e71b1494e8229522',
      '0x14776dc107625db2580d90c6282f0663b5299fd13',
      '0xd9416da54de8b9cf356899834e71b1494e8229523',
    ]
  }
  return {data: result}
};

export {
  getTop10Contributors,
  getMainContents,
};
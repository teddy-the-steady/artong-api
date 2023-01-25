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
      project_address: '0x1523f96d42d8b66703bdd517e0d7244ca8093bfb',
      token_id: '1'
    },
    highlightedProjects: [
      '0xd71b49b0474700984db95c1cc832422f90610481',
      '0x61aa173c27f6a2d0c55632a6c042b6379bad9de7',
      '0x439ad432268bac67af3d28863c6408bd9ebc91c2',
      '0x7551422bb6be31848847b6048dba4e54e0c75b6d',
      '0x4d09304d317714123e118d603337bd15b182a0f3',
      '0x1523f96d42d8b66703bdd517e0d7244ca8093bfb',
      '0x4704cf416a4c6dcb7317cd7ac8b4b9e487159eb3',
      '0x85f31092ef7932a03214c461d2d8f4710c8c4540',
      '0x1b73a3041c28222cfaec130e006c02d7833af5a6',
      '0xfde04dddcb905c47e239825f18067a62997a12b1',
    ],
    artongsPick: [
      '0x61aa173c27f6a2d0c55632a6c042b6379bad9de72',
      '0x4704cf416a4c6dcb7317cd7ac8b4b9e487159eb31',
      '0x0ad824dc35b22413e1c0f356e014d9b985cd257f15',
      '0x439ad432268bac67af3d28863c6408bd9ebc91c23',
      '0x7551422bb6be31848847b6048dba4e54e0c75b6d2',
      '0x0ad824dc35b22413e1c0f356e014d9b985cd257f4',
      '0x439ad432268bac67af3d28863c6408bd9ebc91c22',
      '0x0ad824dc35b22413e1c0f356e014d9b985cd257f4',
      '0x4704cf416a4c6dcb7317cd7ac8b4b9e487159eb36',
      '0x7551422bb6be31848847b6048dba4e54e0c75b6d1',
    ]
  }
  return {data: result}
};

export {
  getTop10Contributors,
  getMainContents,
};
import { PoolClient } from 'pg';
import { Reports, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';

interface PostReportInfo {
  description: string
  category: string
}
const postReport = async function(body: PostReportInfo, member: Member) {
  const conn: PoolClient = await db.getConnection();

  try {
    const reportModel = new Reports({
      description: body.description,
      category: body.category,
      member_id: member.id,
    }, conn);

    let result = await reportModel.createReport(
      reportModel.description,
      reportModel.category,
      reportModel.member_id,
    );

    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
  postReport,
};
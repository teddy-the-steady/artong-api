import { PoolClient } from 'pg';
import { Reports, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';

interface PostReportInfo {
  description: string
  project_address: string
  contents_id: number
  member_id_reported: number
  category: string
}
const postReport = async function(body: PostReportInfo, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const reportModel = new Reports({
      description: body?.description,
      project_address: body?.project_address,
      contents_id: body?.contents_id,
      member_id_reported: body?.member_id_reported,
      category: body.category,
      member_id: member.id,
    }, conn);

    let result = await reportModel.createReport(
      reportModel.description,
      reportModel.project_address,
      reportModel.contents_id,
      reportModel.member_id_reported,
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
import { Projects, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { Client } from 'pg';

const postProject = async function(body: any, member: Member) {
  const conn: Client = await db.getConnection();

  try {
    const projectModel = new Projects({
      address: body.address,
      member_id: member.id,
      name: body.name
    }, conn);

    const result = await projectModel.createProject(
      projectModel.address,
      projectModel.member_id,
      projectModel.name
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

export {
	postProject,
};
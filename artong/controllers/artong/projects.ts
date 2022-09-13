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
      name: body.name,
      status: body.status
    }, conn);

    const result = await projectModel.createProject(
      projectModel.address,
      projectModel.member_id,
      projectModel.name,
      projectModel.status
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

const patchProject = async function(pathParameters: any, body: any, member: Member) {
  const conn: Client = await db.getConnection();

  try {
    const projectModel = new Projects({
      address: pathParameters.address,
      member_id: member.id,
      description: body.description,
      thumbnail_url: body.thumbnail_url,
      background_url: body.background_url,
      status: body.status
    }, conn);

    const result = await projectModel.updateProject(
      projectModel.address,
      projectModel.member_id,
      projectModel.description,
      projectModel.thumbnail_url,
      projectModel.background_url,
      projectModel.status
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
  patchProject,
};
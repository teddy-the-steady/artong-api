import { PoolClient } from 'pg';
import { Member, Projects, Contents } from '../../models/index';
import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';

const searchProjects = async function(queryStringParameters: any, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const projectModel = new Projects({
      name: queryStringParameters.searchWord
    }, conn);

    const result = await projectModel.searchProjects(
      projectModel.name
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

const searchContents = async function(queryStringParameters: any, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const contentModel = new Contents({
      name: queryStringParameters.searchWord
    }, conn);

    const result = await contentModel.searchContents(
      contentModel.name
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

const searchMembers = async function(queryStringParameters: any, member: Member) {
  const conn: PoolClient = await db.getArtongConnection();

  try {
    const memberModel = new Member({
      username: queryStringParameters.searchWord
    }, conn);

    const result = await memberModel.searchMembers(
      memberModel.username
    );
    return {data: result}
  } catch (error) {
    throw controllerErrorWrapper(error)
  } finally {
    db.release(conn);
  }
};

export {
  searchProjects,
  searchContents,
  searchMembers,
};
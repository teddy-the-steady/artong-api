import { Contents, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { Client } from 'pg';

const postContent = async function(body: any) {
  const conn: Client = await db.getConnection();

  try {
    const contentModel = new Contents({
      member_id: body.member_id,
      project_address: body.project_address,
      content_url: body.content_url,
    }, conn);

    const result = await contentModel.createContent(
      contentModel.member_id,
      contentModel.project_address,
      contentModel.content_url
    );
    return {'data': result}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
};

export {
	postContent,
};
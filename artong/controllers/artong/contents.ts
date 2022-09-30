import { Contents, Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import getSecretKeys from '../../utils/common/ssmKeys';
import { Client } from 'pg';

const postContent = async function(body: any, member: Member) {
  const conn: Client = await db.getConnection();

  try {
    const contentModel = new Contents({
      member_id: member.id,
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

const getNftStorageApiKey = async function() {
  try {
    const keys = await getSecretKeys();
    const nftStorageApiKey = keys[`/nftStorage/${process.env.ENV}/apikey`];
    return nftStorageApiKey;
  } catch (error) {
    throw controllerErrorWrapper(error);
  }
};

export {
	postContent,
  getNftStorageApiKey,
};
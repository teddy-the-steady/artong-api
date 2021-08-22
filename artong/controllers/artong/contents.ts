import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { Contents, Uploads } from '../../models/index';
const insertUpload = require('../../models/uploads/insertUpload.sql');
const insertContent = require('../../models/contents/insertContent.sql');

const createContent = async function(body: any) {
  let conn: any;

  try {   
    const upload = new Uploads({
      username: body.username,
      description: body.description, // TODO] #단어 파싱해서 태그에 넘기자
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const insertedId = await db.execute(conn, insertUpload, upload);
    const content = new Contents({
      content_url: body.content_url,
      thumbnail_url: body.thumbnail_url, // TODO] 파일 리사이징 모듈(람다?) 만들기 
      upload_id: insertedId[0].id,
    });
    await db.execute(conn, insertContent, content);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

export {
	createContent,
};
import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { Contents, Uploads, UploadActions } from '../../models/index';
import validator from '../../utils/validators/common';
const insertUploadAndContents = require('../../models/uploads/insertUploadAndContents.sql');
const selectUploads = require('../../models/uploads/selectUploads.sql');
const insertUploadActions = require('../../models/actions/insertUploadActions.sql')

const getUploadsList = async function(queryStringParameters: any, userId: string) {
  let result: any;
  let conn: any;

  try {
    queryStringParameters['userId'] = userId;
    
    conn = await db.getConnection();
    result = await db.execute(conn, selectUploads, queryStringParameters);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result}
}

const createUpload = async function(body: any) {
  let conn: any;

  try {   
    const upload = new Uploads({
      username: body.username,
      description: body.description, // TODO] #단어 파싱해서 태그에 넘기자
      thumbnail_url: body.thumbnail_url, // TODO] 파일 리사이징 모듈(람다?) 만들기 
    });
    await validator(upload);

    const content = new Contents({
      content_url: body.content_url
    });

    const uploadAndcontent = upload.pourObjectIntoUploads(content);

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    await db.execute(conn, insertUploadAndContents, uploadAndcontent);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

const createUploadAction = async function(pathParameters: any, body: any) {
  let conn: any;
  
  try {
    const action = new UploadActions({
      action_id: body.action_code,
      upload_id: pathParameters.id,
      member_id: body.username
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    await db.execute(conn, insertUploadActions, action);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
}

export {
  getUploadsList,
	createUpload,
  createUploadAction,
};
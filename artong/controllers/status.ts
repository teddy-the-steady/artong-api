import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import { Status } from '../models/index';
import { BadRequest, InternalServerError } from '../utils/error/errors';
import { UniqueValueDuplicated, UpdateFailed } from '../utils/error/errorCodes';
const insertStatus = require('../models/status/insertStatus.sql');
const updateStatus = require('../models/status/updateStatus.sql');
const selectStatusList = require('../models/status/selectStatusList.sql');
const selectStatus = require('../models/status/selectStatus.sql');

const createStatus = async function(body: any) {
  let conn: any;

  try {
    const status = new Status({
      code: body.code,
      description: body.description,
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const statusId = await db.execute(conn, selectStatus, status);
    if (statusId.length) {
      throw new BadRequest(UniqueValueDuplicated.message + ': status.code', UniqueValueDuplicated.code);
    } else await db.execute(conn, insertStatus, status);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

const putStatus = async function(pathParameters: any, body: any) {
  let conn: any;

  try {
    const status = new Status({
      id: pathParameters.id,
      code: body.code,
      description: body.description,
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const updatedId = await db.execute(conn, updateStatus, status);
    if (updatedId.length) await db.execute(conn, insertStatus, status);
    else throw new InternalServerError(UpdateFailed.message, UpdateFailed.code);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

const getStatusList = async function(queryStringParameters: any) {
  let result: any;
  let conn: any;

  try {
    conn = await db.getConnection();
    result = await db.execute(conn, selectStatusList, queryStringParameters);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result}
};

export {
	createStatus,
  putStatus,
  getStatusList,
};
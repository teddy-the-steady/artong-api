import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import { Status } from '../models/index';
import { BadRequest, Forbidden } from '../utils/error/errors';
import { NoPermission, UniqueValueDuplicated } from '../utils/error/errorCodes';
import { hasBOPermission } from '../utils/common/commonFunc';
import { plainToClass } from 'class-transformer';
import validator from '../utils/validators/common';
const insertStatus = require('../models/status/insertStatus.sql');
const updateStatus = require('../models/status/updateStatus.sql');
const selectStatusList = require('../models/status/selectStatusList.sql');
const selectStatus = require('../models/status/selectStatus.sql');

const createStatus = async function(body: any, userGroups: Array<string>) {
  let conn: any;

  try {
    if (!hasBOPermission(userGroups)) throw new Forbidden(NoPermission.message, NoPermission.code);
    
    const status = plainToClass(Status, {
      code: body.code,
      description: body.description,
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const statusId = await db.execute(conn, selectStatus, status);
    if (statusId.length) {
      throw new BadRequest(`${UniqueValueDuplicated.message}: status.code`, UniqueValueDuplicated.code);
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

const putStatus = async function(pathParameters: any, body: any, userGroups: Array<string>) {
  let conn: any;

  try {
    if (!hasBOPermission(userGroups)) throw new Forbidden(NoPermission.message, NoPermission.code);
    
    const status = plainToClass(Status, {
      id: pathParameters.id,
      code: body.code,
      description: body.description,
    });
    await validator(status)

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const updatedId = await db.execute(conn, updateStatus, status);
    if (updatedId.length) await db.execute(conn, insertStatus, status);
    else throw new Forbidden(NoPermission.message, NoPermission.code);

    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'success'}
};

const getStatusList = async function(queryStringParameters: any, userGroups: Array<string>) {
  let result: any;
  let conn: any;

  try {
    if (!hasBOPermission(userGroups)) throw new Forbidden(NoPermission.message, NoPermission.code);

    conn = await db.getConnection();
    result = await db.execute(conn, selectStatusList, queryStringParameters);
  } catch (error) {
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
import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import { Test } from '../models/index';
const insertTest = require('../models/test/insertTest.sql');
const selectTest = require('../models/test/selectTest.sql');
const selectTestList = require('../models/test/selectTestList.sql');

const createTest = async function(body: any) {
  let result: any;
  let conn: any;

  try {
    const test = new Test({name: body.name, value: body.value});
    
    conn = await db.getConnection();
    await db.beginTransaction(conn);
    result = await db.execute(conn, insertTest, test);
    await db.commit(conn);
  } catch (error) {
    if (conn) await db.rollBack(conn);
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': 'Success'}
};

const getTests = async function(queryParameters: any) {
	let result: any;
	let params: any = {};
	let conn: any;

	try {
		conn = await db.getConnection();
		result = await db.execute(conn, selectTestList, params);
	} catch (error) {
		controllerErrorWrapper(error);
	} finally {
		if (conn) db.release(conn);
	}
	return {'data': result}
};

const getTest = async function(pathParameters: {id: number}, queryParameters: any) {
  let result: any;
  let conn: any;
    
  try {
    const test = new Test({id: pathParameters.id});
    conn = await db.getConnection();
    result = await db.execute(conn, selectTest, test);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result[0]}
};

export {
	createTest,
	getTests,
	getTest,
};
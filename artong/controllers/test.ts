export {};
const db = require('../utils/db/db');
const {controllerErrorWrapper} = require('../utils/error/errorWrapper');
const {validate} = require('../utils/validators/common');
const {Test} = require('../models');

const createTest = async function(body: any) {
  let result: any;
  let conn: any;

  try {
    await validate(body, Test.testSchema);
    const test = new Test({name: body.name, value: body.value});
    
    conn = await db.getConnection();
    await db.beginTransaction(conn);
    result = await db.execute(conn, 'test.insertTest', test);
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
		result = await db.execute(conn, 'test.selectTestList', params);
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
    result = await db.execute(conn, 'test.selectTest', test);
  } catch (error) {
    controllerErrorWrapper(error);
  } finally {
    if (conn) db.release(conn);
  }
  return {'data': result[0]}
};

module.exports = {
	createTest,
	getTests,
	getTest,
}
export {};
const {pool} = require('../../init');
const db = require('../../utils/db/db');
const {InternalServerError, BadRequest} = require('../../utils/error/errors');

const control = async function (queryParameters: any, pathParameters: {barcode: string}) {
  let result: any = {};
  let params = {barcode: pathParameters.barcode};

  const conn = await db.getConnection(pool);
  
  try {
    result = await db.execute(conn, 'productModels.selectProduct', params);
  } catch (error) {
    console.error(error);
    if (error instanceof InternalServerError) {
      throw new InternalServerError(error['errorMessage'], error['errorCode'])
    } else if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else {
      throw new InternalServerError()
    }
  } finally {
    db.release(conn);
  }

  return {'data': result[0]}
};

module.exports.control = control;

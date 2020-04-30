const {pool} = require('../../init');
const db = require('../../utils/db/db');
const {InternalServerError} = require('../../utils/error/errors');

const control = async function (queryParameters, pathParameters) {
  let result = {};
  let params = {barcode: pathParameters.barcode};

  const conn = await db.getConnection(pool);
  
  try {
    result = await db.execute(conn, 'productModels.selectProduct', params);
  } catch (error) {
    console.log(error);
    throw new InternalServerError()
  } finally {
    db.release(conn);
  }

  return {"data": result[0]}
};

module.exports.control = control;

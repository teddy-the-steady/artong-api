const init = require('../../init');
const db = require('../../utils/db/db');
const errors = require('../../utils/error/errors');
const productSchema = require('../../utils/validation/schema').productSchema;

const control = async function (queryParameters, pathParameters) {
  let result = {};
  let params = queryParameters
  params['barcode'] = pathParameters.barcode

  try {
    if (params !== null) {
      params = await productSchema.validateAsync(params);
    }
  } catch (error) {
    throw new errors.BadRequest(error.details[0].message, 400)
  }

  const conn = await db.getConnection(init.pool);
  
  try {
    result = await db.execute(conn, 'productModels.selectProduct', params);
  } catch (error) {
    console.log(error);
    throw new errors.InternalServerError()
  } finally {
    db.release(conn);
  }

  return result
};

module.exports.control = control;
const init = require('../../init');
const db = require('../../utils/db/db');
const errors = require('../../utils/error/errors');
const productListSchema = require('../../utils/validation/schema').productListSchema;

const control = async function (queryParameters) {
  let result = {};
  let params = queryParameters;

  try {
    if (params !== null) {
      params = await productListSchema.validateAsync(params);
    }
  } catch (error) {
    throw new errors.BadRequest(error.details[0].message, 400)
  }

  const conn = await db.getConnection(init.pool);

  try {
    result = await db.execute(conn, 'productModels.selectProductList', params);
  } catch (error) {
    console.log(error);
    throw new errors.InternalServerError()
  } finally {
    db.release(conn);
  }

  return result
};

module.exports.control = control;
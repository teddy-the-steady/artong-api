import * as db from '../utils/db/db';
import controllerErrorWrapper from '../utils/error/errorWrapper';
import { Country } from '../models/index';
import { BadRequest } from '../utils/error/errors';
import { UniqueValueDuplicated } from '../utils/error/errorCodes';
const insertCountry = require('../models/country/insertCountry.sql');
const selectCountry = require('../models/country/selectCountry.sql');

const createCountry = async function(body: any) {
  let conn: any;

  try {
    const country = new Country({
			iso_code_3: body.iso_code_3,
      iso_code_2: body.iso_code_2,
			name: body.name,
			number_code: body.number_code,
    });

    conn = await db.getConnection();
    await db.beginTransaction(conn);

    const result = await db.execute(conn, selectCountry, country);
    if (result.length) {
      throw new BadRequest(UniqueValueDuplicated.message + ': country.iso_code', UniqueValueDuplicated.code);
    } else await db.execute(conn, insertCountry, country);

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
	createCountry,
};
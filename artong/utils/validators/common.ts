import { BadRequest } from '../error/errors';
import { MissingRequiredData } from '../error/errorCodes';

const  validate = async function(params: any, schema: any) {
  if (params) {
    await schema.validateAsync(params);
  } else {
    throw new BadRequest(MissingRequiredData.message, MissingRequiredData.code)
  }
}

export default validate;
import { BadRequest } from '../error/errors';
import { MissingRequiredData } from '../error/errorCodes';
import { validateOrReject } from 'class-validator';

const validator = async function(input: any) {
  if (input) {
    await validateOrReject(input);
  } else {
    throw new BadRequest(MissingRequiredData.message, MissingRequiredData.code);
  }
}

export default validator;
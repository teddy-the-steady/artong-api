import { BadRequest } from '../error/errors';
import { ValidationError } from '../error/errorCodes';
import { validateOrReject } from 'class-validator';

const validator = async function(input: any) {
  try {
    await validateOrReject(input);
  } catch (error) {
    throw new BadRequest(error.toString(), ValidationError.code);
  }
}

export default validator;
import init from '../init'
import {getConnection, release, execute} from '../utils/db/db'
import {BadRequest, InternalServerError} from '../utils/error/errors'
import {MissingQueryParameter, ValidationError} from '../utils/error/errorCodes'
import schema from '../utils/validation/schema'

const testViewController = async function (queryParameters: any, pathParameters: {id: number}) {
  let result: any = {};
  let params: any = {id: pathParameters.id}
  
  try {
    if (queryParameters) {
      queryParameters = await schema.testSchema.validateAsync(queryParameters);
      params['query'] = queryParameters
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else if (error['details'] && error['details'][0]['message']) {
      throw new BadRequest(error['details'][0]['message'], MissingQueryParameter)
    } else {
      throw new BadRequest(error, ValidationError)
    }
  }

  const conn = await getConnection(init.pool);
  
  try {
    result = await execute(conn, 'selectTest', params);
  } catch (error) {
    console.error(error);
    if (error instanceof InternalServerError) {
      throw new InternalServerError(error['errorMessage'], error['errorCode'])
    } else if (error instanceof BadRequest) {
      throw new BadRequest(error['errorMessage'], error['errorCode'])
    } else {
      throw new InternalServerError('', null)
    }
  } finally {
    release(conn);
  }

  return {'data': result[0]}
};

export {testViewController}
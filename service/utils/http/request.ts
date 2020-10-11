import {BadRequest} from '../../utils/error/errors'
import {SyntaxError} from '../../utils/error/errorCodes'

const request = (event: any) => {
  let result: any = {};
  
  result['httpMethod'] = event['httpMethod'];
  result['path'] = event['path'];
  result['queryStringParameters'] = event['queryStringParameters'];
  result['pathParameters'] = event['pathParameters']
  result['body'] = event['body'];
  try {
    result.body = JSON.parse(result.body);
  } catch(error){
    throw new BadRequest(error.toString(), SyntaxError)
  }

  if (event['requestContext']['authorizer'] && event['requestContext']['authorizer']['principalId']) {
    result['userId'] = event['requestContext']['authorizer']['principalId'];
  }

  return result
};

export {request};
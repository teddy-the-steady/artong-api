import { BadRequest } from '../error/errors';
import { SyntaxError } from '../error/errorCodes';

const requestInit = (event: any) => {
  let result: any = {};
  
  result['httpMethod'] = event['httpMethod'];
  result['path'] = event['path'];
  result['queryStringParameters'] = event['queryStringParameters'];
  result['pathParameters'] = event['pathParameters'];

  result['body'] = event['body'];
  if (result['body']) {
    try {
      result.body = JSON.parse(result.body);
    } catch(error){
      throw new BadRequest(error.toString(), SyntaxError);
    }
  }

  if (event['requestContext']['authorizer'] && event['requestContext']['authorizer']['principalId']) {
    result['userId'] = event['requestContext']['authorizer']['principalId'];
  }

  const jwtToken = event['headers']['Authorization'];
  if (jwtToken) {
    const payload = parseJwt(jwtToken);
    result['userGroups'] = payload['cognito:groups'];
  }

  return result
};

const parseJwt = (token: any) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(Buffer.from(base64, "base64").toString().split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export default requestInit;
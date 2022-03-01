import { BadRequest, InternalServerError } from '../error/errors';
import { SyntaxError, UnknownError } from '../error/errorCodes';
import { member } from '../../controllers/artong';

const requestInit = async function(event: any) {
  let result: any = {};

  result['httpMethod'] = event['httpMethod'];
  result['path'] = event['path'].substring(event['path'].indexOf('/artong'));
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
    try {
      let auth_id = event['requestContext']['authorizer']['principalId']
      if (process.env.IS_OFFLINE) { // offline에서 member_id로 user 세팅
        const member_id = event['queryStringParameters'] && event['queryStringParameters']['member_id'] ? event['queryStringParameters']['member_id'] : 249;
        const result = await member.getMemberAuthId({ member_id: member_id });
        auth_id = result.data.auth_id;
      }
      const user = await member.getMemberSecure({ auth_id: auth_id });
      result['user'] = user.data
    } catch (error) {
      throw new InternalServerError(error, UnknownError.code);
    }
  }

  const jwtToken = event['headers']['Authorization'];
  if (jwtToken) {
    const payload = parseJwt(jwtToken);
    result['user']['userGroups'] = payload['cognito:groups'];
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
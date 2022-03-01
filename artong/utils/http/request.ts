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

  try {
    result['user'] = {};
    let auth_id = null;
    if (process.env.IS_OFFLINE) { // offline이면 queryStringParameters로 member_id 세팅(없으면 stage는 default 249)
      const member_id = event['queryStringParameters'] && event['queryStringParameters']['member_id'] ? event['queryStringParameters']['member_id'] : 249;
      const result = await member.getMemberAuthId({ member_id: member_id });
      auth_id = result.data.auth_id;
    }

    let payload = null;
    const jwtToken = event['headers']['Authorization'];
    if (jwtToken) {
      payload = parseJwt(jwtToken);
      result['user']['userGroups'] = payload['cognito:groups'];
      auth_id = payload['sub'];
    }

    if (auth_id) {
      const user = await member.getMemberSecure({ auth_id: auth_id });
      result['user'] = user.data
    }
  } catch (error) {
    throw new InternalServerError(error, UnknownError.code);
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
import { BadRequest } from '../error/errors';
import { SyntaxError } from '../error/errorCodes';
import { member } from '../../controllers/artong';
import controllerErrorWrapper from '../error/errorWrapper';

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
    result['member'] = {};
    let usernameOrMemberId = null;
    if (process.env.IS_OFFLINE) { // offline이면 queryStringParameters로 member_id 세팅(없으면 stage는 admin 249)
      usernameOrMemberId = event['queryStringParameters'] && event['queryStringParameters']['member_id'] ? event['queryStringParameters']['member_id'] : 249;
    }

    const jwtToken = event['headers']['Authorization'];
    if (jwtToken) {
      const payload = parseJwt(jwtToken);
      result['member']['memberGroups'] = payload['cognito:groups'];
      usernameOrMemberId = payload['username'];
    }

    if (usernameOrMemberId) {
      const user = await member.getMember({ id: usernameOrMemberId });
      result['member'] = Object.assign(result['member'], user.data)
    }
  } catch (error) {
    controllerErrorWrapper(error);
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
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
    let memberId = null;
    let principalId = null;
    if (process.env.IS_OFFLINE) { // INFO] offline이면 queryStringParameters로 받은 member_id 세팅(없으면 stage는 admin 249)
      memberId = event['queryStringParameters'] && event['queryStringParameters']['member_id'] ? event['queryStringParameters']['member_id'] : 249;
    } else if (event['headers']['Authorization']) {
      const jwtToken = event['headers']['Authorization'];
      if ( // INFO] cognito authorized
        event['requestContext'] &&
        event['requestContext']['authorizer'] &&
        event['requestContext']['authorizer']['principalId']
      ) {
        const payload = parseJwt(jwtToken);
        result['member']['memberGroups'] = payload['cognito:groups'];
        principalId = event['requestContext']['authorizer']['principalId'];
      } else { // INFO] when authorization is not needed, just open header to check who the sender is (however, token not verified)
        const payload = parseJwt(jwtToken);
        principalId = payload['sub'];
      }
    }

    if (memberId) {
      const user = await member.getMember({ id: memberId });
      result['member'] = Object.assign(result['member'], user.data);
    }

    if (principalId) {
      const user = await member.getMember({ principal_id: principalId });
      result['member'] = Object.assign(result['member'], user.data);
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
export {};
const {BadRequest} = require('../../utils/error/errors');
const {SyntaxError} = require('../../utils/error/errorCodes');

const init = (event: any) => {
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

module.exports.init = init;
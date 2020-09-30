const init = (event: any) => {
  let result: any = {};
  
  result['httpMethod'] = event['httpMethod'];
  result['path'] = event['path'];
  result['queryStringParameters'] = event['queryStringParameters'];
  result['pathParameters'] = event['pathParameters']
  result['body'] = event['body']
  if (event['requestContext']['authorizer'] && event['requestContext']['authorizer']['principalId']) {
    result['userId'] = event['requestContext']['authorizer']['principalId'];
  }

  return result
};

module.exports.init = init;
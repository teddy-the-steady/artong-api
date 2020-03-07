const init = (event) => {
  let result = {};
  
  result['httpMethod'] = event['httpMethod'];
  result['path'] = event['path'];
  result['queryStringParameters'] = event['queryStringParameters'];
  result['pathParameters'] = event['pathParameters']
  result['body'] = event['body']
  if (event.requestContext.authorizer && event.requestContext.authorizer.claims) {
    result['cognitoUser'] = event.requestContext.authorizer.claims
  }

  return result
};

module.exports.init = init;
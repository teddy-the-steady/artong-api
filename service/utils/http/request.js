const init = (event) => {
  let result = {};
  
  result['httpMethod'] = event['httpMethod'];
  result['path'] = event['path'];
  result['queryStringParameters'] = event['queryStringParameters'];
  result['pathParameters'] = event['pathParameters']
  result['body'] = event['body']

  return result
};

module.exports.init = init;
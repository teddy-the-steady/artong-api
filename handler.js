'use strict';

module.exports.hello = (event, context, callback) => {

  let param = 'Serverless'
  if ('queryStringParameters' in event) {
    if (event.queryStringParameters != null && 'name' in event.queryStringParameters) {
      param = event.queryStringParameters.name
    }
  }

  const response =  {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${param}!`,
    }),
  };

  callback(null, response)
};

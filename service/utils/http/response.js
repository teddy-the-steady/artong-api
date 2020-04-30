const {ALLOWED_ORIGINS} = require('../../init');

const setCorsHeader = (event, ALLOWED_ORIGINS) => {
    const origin = event.headers.origin;
    let headers;
  
    if (ALLOWED_ORIGINS.includes(origin)) {
        headers = {
            'X-Requested-With': '*',
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
            'Access-Control-Allow-Credentials': true
        }
    } else {
        headers = {
            // 'X-Requested-With': '*',
            'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
            // 'Access-Control-Allow-Methods': 'POST,GET,OPTIONS'
        }
    };
    return headers
};

module.exports.successResponse = (event, obj, callback) => {
    const corsHeaders = setCorsHeader(event, ALLOWED_ORIGINS)
    callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(obj)
    });
};

module.exports.errorResponse = (event, error, callback) => {
    const corsHeaders = setCorsHeader(event, ALLOWED_ORIGINS)
    if (event !== null) {
        corsHeaders = setCorsHeader(event, ALLOWED_ORIGINS)
    }
    callback(null, {
        statusCode: error.statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            message: error
        })
    });
};


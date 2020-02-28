const setCorsHeader = (event, ALLOWED_ORIGINS) => {
    const origin = event.headers.origin;
    let headers;
  
    if (ALLOWED_ORIGINS.includes(origin)) {
        headers = {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': true
        }
    } else {
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    };
    return headers
};

module.exports.successResponse = (event, ALLOWED_ORIGINS, obj, callback) => {
    const corsHeaders = setCorsHeader(event, ALLOWED_ORIGINS);
    callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(obj)
    });
};

module.exports.errorResponse = (event, ALLOWED_ORIGINS, error, callback) => {
    const corsHeaders = setCorsHeader(event, ALLOWED_ORIGINS);
    callback(null, {
        statusCode: error.statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            message: error
        })
    });
};

module.exports.optionsResponse = (callback) => {
    callback(null, {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' : 'Accept, Content-Type, Origin'
        }
    });
};

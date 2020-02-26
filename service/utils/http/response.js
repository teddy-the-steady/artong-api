const corsHeaders = {
    'Access-Control-Allow-Origin': '*'
};

module.exports.successResponse = (obj, callback) => {
    callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(obj)
    });
};

module.exports.errorResponse = (error, callback) => {
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

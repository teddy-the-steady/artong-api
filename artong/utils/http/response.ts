import { ALLOWED_ORIGINS } from '../../init';

const setCorsHeader = (event: any, allowedOrigins: string[]) => {
    const origin = event.headers.origin;
    let headers;
  
    if (allowedOrigins.includes(origin)) {
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

const successResponse = (event: any, obj: any, callback: any) => {
    const corsHeaders = setCorsHeader(event, ALLOWED_ORIGINS)
    callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(obj)
    });
};

const errorResponse = (event: any, error: any, callback: any) => {
    let corsHeaders = {}
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

export {
	successResponse,
	errorResponse,
};
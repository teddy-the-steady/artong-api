const mysql = require('mysql2/promise');
const httpRequest = require('../utils/http/request');
const httpResponse = require('../utils/http/response');
const testListController = require('../controllers/testListController');
const testViewController = require('../controllers/testViewController');
const testCreateController = require('../controllers/testCreateController');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const ALLOWED_ORIGINS = [
	'https://myfirstorigin.com',
	'https://mysecondorigin.com'
];

module.exports.test = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const requestInfo = httpRequest.init(event);

  let res = {};

  try {
    switch (requestInfo.httpMethod) {
      case 'GET':
        if (requestInfo.path === '/test/product' || requestInfo.path === '/test/product/')
          res = await testListController.control(pool, requestInfo.queryStringParameters);
        else if (requestInfo.path.startsWith('/test/product/') && requestInfo.pathParameters)
          res = await testViewController.control(pool, requestInfo.queryStringParameters, requestInfo.pathParameters);
        break;
      case 'POST':
        requestInfo.body = JSON.parse(requestInfo.body);
        if (requestInfo.path === '/test/product' || requestInfo.path === '/test/product/')
          res = await testCreateController.control(pool, requestInfo.body);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    httpResponse.errorResponse(event, ALLOWED_ORIGINS, error, callback);
  }

  httpResponse.successResponse(event, ALLOWED_ORIGINS, res, callback);
};
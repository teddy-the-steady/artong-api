const mysql = require('mysql2/promise');

module.exports.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

module.exports.ALLOWED_ORIGINS = [
  'https://myfirstorigin.com',
  'https://mysecondorigin.com'
];
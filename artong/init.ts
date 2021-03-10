import { Pool } from 'pg';
import handlebars from 'handlebars';
const AWS = require('aws-sdk');

const ssm = new AWS.SSM();
const secretKeyPromise = ssm.getParameters({
  Names: [
    '/db/host',
    '/db/stage/database',
    '/db/user',
    '/db/password',
  ],
  WithDecryption: true
}).promise();

const secretKey = async function() {
  const keys = await secretKeyPromise;
  return formatKeys(keys.Parameters);
}

const formatKeys = function(keys: Array<any>) {
  return keys.reduce((acc, cur) => {
    acc[cur.Name] = cur.Value;
    return acc;
  }, {});
}

const getPool = async function() {
  const keys = await secretKey();
  return new Pool({
    host: keys['/db/host'],
    user: keys['/db/user'],
    password: keys['/db/password'],
    database: keys['/db/stage/database'],
    port: 5432
  });
}

const ALLOWED_ORIGINS: string[] = [
  'https://myfirstorigin.com',
  'https://mysecondorigin.com'
];

const reduceOp = function(args: any, reducer: (a: string, b: string) => any) {
  args = Array.from(args);
  args.pop();
  var first = args.shift();
  return args.reduce(reducer, first);
};

handlebars.registerHelper({
  eq  : function(){ return reduceOp(arguments, (a: string, b: string) => a === b); },
  ne  : function(){ return reduceOp(arguments, (a: string, b: string) => a !== b); },
  lt  : function(){ return reduceOp(arguments, (a: string, b: string) => a  <  b); },
  gt  : function(){ return reduceOp(arguments, (a: string, b: string) => a  >  b); },
  lte : function(){ return reduceOp(arguments, (a: string, b: string) => a  <= b); },
  gte : function(){ return reduceOp(arguments, (a: string, b: string) => a  >= b); },
  and : function(){ return reduceOp(arguments, (a: string, b: string) => a  && b); },
  or  : function(){ return reduceOp(arguments, (a: string, b: string) => a  || b); },
}); 

export {
  getPool,
  ALLOWED_ORIGINS,
};
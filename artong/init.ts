import { Pool } from 'pg';
import handlebars from 'handlebars';
const AWS = require('aws-sdk');

const getPool = async function() {
  try {
    const keys = await secretKey();
    return new Pool({
      host: keys['/db/host'],
      user: keys['/db/user'],
      password: keys['/db/password'],
      database: keys['/db/stage/database'],
      port: 5432
    });
  } catch (error) {
    console.error(error);
  }
}

const ssm = new AWS.SSM();
const secretKeyPromise = ssm.getParameters({
  Names: [
    '/db/host',
    '/db/stage/database',
    '/db/user',
    '/db/password',
  ],
  WithDecryption: true
});

const secretKey = async function() {
  try {
    const keys = await secretKeyPromise.promise();
    return formatKeys(keys.Parameters);
  } catch (error) {
    console.error(error);
  }
}

const formatKeys = function(keys: Array<any>) {
  return keys.reduce((acc, cur) => {
    acc[cur.Name] = cur.Value;
    return acc;
  }, {});
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
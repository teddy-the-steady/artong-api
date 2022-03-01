import { Pool } from 'pg';
import handlebars from 'handlebars';
import getSecretKeys from './utils/common/ssmKeys';

const getPool = async function() {
  try {
    const keys = await getSecretKeys();
    return new Pool({
      host: process.env.IS_OFFLINE? 'localhost' : keys[`/db/${process.env.ENV}/host`],
      user: keys[`/db/${process.env.ENV}/user`],
      password: keys[`/db/${process.env.ENV}/password`],
      database: keys[`/db/${process.env.ENV}/database`],
      port: 5432,
      max: 20,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 1000,
    });
  } catch (error) {
    console.error(error);
  }
};

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

const existsConditionToCheckOnlyUndefined = function(variable: any, options: any) {
  if (typeof variable !== 'undefined') {
    return options.fn();
  } else {
    return options.inverse();
  }
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
  exists : existsConditionToCheckOnlyUndefined,
}); 

export {
  getPool,
  ALLOWED_ORIGINS,
};
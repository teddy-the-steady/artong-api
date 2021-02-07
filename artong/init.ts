export{};
const { Pool } = require('pg');
const handlebars = require('handlebars');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 5432
});

const ALLOWED_ORIGINS: string[] = [
  'https://myfirstorigin.com',
  'https://mysecondorigin.com'
];

const reduceOp = function (args: any, reducer: (a: string, b: string) => any) {
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

module.exports = {
  pool,
  ALLOWED_ORIGINS,
}
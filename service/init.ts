const mysql = require('mysql2/promise');
const handlebars = require('handlebars');

const init = {
  pool: mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  }),

  ALLOWED_ORIGINS: [
    'https://myfirstorigin.com',
    'https://mysecondorigin.com'
  ],

  reduceOp: function (args: any, reducer: (a: string, b: string) => any) {
    args = Array.from(args);
    args.pop();
    var first = args.shift();
    return args.reduce(reducer, first);
  },

  helper: handlebars.registerHelper({
    eq  : function(){ return this.reduceOp(arguments, (a: string, b: string) => a === b); },
    ne  : function(){ return this.reduceOp(arguments, (a: string, b: string) => a !== b); },
    lt  : function(){ return this.reduceOp(arguments, (a: string, b: string) => a  <  b); },
    gt  : function(){ return this.reduceOp(arguments, (a: string, b: string) => a  >  b); },
    lte : function(){ return this.reduceOp(arguments, (a: string, b: string) => a  <= b); },
    gte : function(){ return this.reduceOp(arguments, (a: string, b: string) => a  >= b); },
    and : function(){ return this.reduceOp(arguments, (a: string, b: string) => a  && b); },
    or  : function(){ return this.reduceOp(arguments, (a: string, b: string) => a  || b); },
  })
};

export default init;
const fs = require('fs');
const handlebars = require('handlebars');

const getConnection = async function (pool) {
    const conn = await pool.getConnection();
    return conn
};

const release = function (conn) {
    conn.release();
};

const sqlLoader = function (model) {
    const base = process.env.PWD;
    const modelUri = base + '/service/models/' + model.replace('.', '/') + '.sql';
    const sql = fs.readFileSync(modelUri).toString();
    const preCompiledModel = handlebars.compile(sql);

    return preCompiledModel
};

const execute = async function (conn, model, params) {
    let result = null;
    const preCompiledModel = sqlLoader(model);
    const compiledModel = preCompiledModel(params);
    result = await conn.query(compiledModel);

    return result[0]
};

const reduceOp = function(args, reducer){
    args = Array.from(args);
    args.pop();
    var first = args.shift();
    return args.reduce(reducer, first);
};

handlebars.registerHelper({
    eq  : function(){ return reduceOp(arguments, (a,b) => a === b); },
    ne  : function(){ return reduceOp(arguments, (a,b) => a !== b); },
    lt  : function(){ return reduceOp(arguments, (a,b) => a  <  b); },
    gt  : function(){ return reduceOp(arguments, (a,b) => a  >  b); },
    lte : function(){ return reduceOp(arguments, (a,b) => a  <= b); },
    gte : function(){ return reduceOp(arguments, (a,b) => a  >= b); },
    and : function(){ return reduceOp(arguments, (a,b) => a  && b); },
    or  : function(){ return reduceOp(arguments, (a,b) => a  || b); },
}); 

module.exports.getConnection = getConnection;
module.exports.release = release;
module.exports.execute = execute;

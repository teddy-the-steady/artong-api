export {};
const fs = require('fs');
const handlebars = require('handlebars');

const getConnection = async function (pool: any) {
    const conn = await pool.getConnection();
    return conn
};

const release = function (conn: any): void {
    conn.release();
};

const sqlLoader = function (model: string) {
    const base = process.env.PWD;
    const modelUri = base + '/service/models/' + model.replace('.', '/') + '.sql';
    const sql = fs.readFileSync(modelUri).toString();
    const preCompiledModel = handlebars.compile(sql);

    return preCompiledModel
};

const execute = async function (conn: any, model: string, params: any) {
    let result = null;
    const preCompiledModel = sqlLoader(model);
    const compiledModel = preCompiledModel(params);
    /* 쿼리 debug시 주석 해제 */
    // console.log(compiledModel);
    result = await conn.query(compiledModel);

    return result[0]
};

module.exports.getConnection = getConnection;
module.exports.release = release;
module.exports.execute = execute;

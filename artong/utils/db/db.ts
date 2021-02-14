export {};
const fs = require('fs');
const handlebars = require('handlebars');
const {pool} = require('../../init');

const getConnection = async function() {
  const conn = await pool.connect();
  return conn
};

const release = function(conn: any): void {
  conn.release();
};

const sqlLoader = function(model: string) {
  const base = process.env.PWD;
  const modelUri = base + '/artong/models/' + model.replace('.', '/') + '.sql';
  const sql = fs.readFileSync(modelUri).toString();
  const preCompiledModel = handlebars.compile(sql);

  return preCompiledModel
};

const execute = async function(conn: any, model: string, params: any) {
  let result = null;
  const preCompiledModel = sqlLoader(model);
  const compiledModel = preCompiledModel(params);
  /* 쿼리 debug시 주석 해제 */
  // console.log(compiledModel);
  result = await conn.query(compiledModel);
  return result['rows']
};

const beginTransaction = async function(conn: any) {
  conn.query('BEGIN');
}

const commit = async function(conn: any) {
  conn.query('COMMIT');
}

const rollBack = async function(conn: any) {
  conn.query('ROLLBACK');
}

module.exports = {
  getConnection,
  release,
  execute,
  beginTransaction,
  commit,
  rollBack,
}
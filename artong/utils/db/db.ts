import handlebars from 'handlebars';
import { getPool } from '../../init';
import { InternalServerError } from '../error/errors';
import { DBError } from '../error/errorCodes';

const getConnection = async function() {
  const pool: any = await getPool();
  const conn = await pool.connect();
  return conn
};

const release = function(conn: any) {
  conn.release();
};

const compileSQL = function(sql: string) {
  const preCompiledModel = handlebars.compile(sql);
  return preCompiledModel
}

const execute = async function(conn: any, sql: string, params: any) {
  const preCompiledModel = compileSQL(sql);
  const compiledModel = preCompiledModel(params);
  /* 쿼리 debug시 주석 해제 */
  // console.log(compiledModel);
  try {
    const result = await conn.query(compiledModel);
    return result['rows']
  } catch (error) {
    throw new InternalServerError(error, DBError.code);
  }
};

const beginTransaction = async function(conn: any) {
  await conn.query('BEGIN');
}

const commit = async function(conn: any) {
  await conn.query('COMMIT');
}

const rollBack = async function(conn: any) {
  await conn.query('ROLLBACK');
}

export {
  getConnection,
  release,
  execute,
  beginTransaction,
  commit,
  rollBack,
};
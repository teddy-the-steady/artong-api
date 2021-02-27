import fs from 'fs'
import handlebars from 'handlebars';
import { pool } from '../../init';

const getConnection = async function() {
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
  const result = await conn.query(compiledModel);
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

export {
  getConnection,
  release,
  execute,
  beginTransaction,
  commit,
  rollBack,
};
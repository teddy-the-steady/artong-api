import handlebars from 'handlebars';
import { dbConnectionPool } from '../../handler/artong';
import { InternalServerError } from '../error/errors';
import { DBError } from '../error/errorCodes';
import { replaceAll } from '../common/commonFunc';
import { PoolClient } from 'pg';

const getConnection = async function(): Promise<PoolClient> {
  try {
    const conn = await dbConnectionPool.connect();
    return conn
  } catch (error) {
    throw new InternalServerError(error, DBError.code);
  }
};

const release = function(conn: any) {
  conn.release();
};

const compileSQL = function(sql: string) {
  const preCompiledModel = handlebars.compile(sql);
  return preCompiledModel
}

const execute = async function(conn: PoolClient, sql: string, params: any) {
  const preCompiledModel = compileSQL(sql);
  const compiledModel = preCompiledModel(params);
  const convertedSql = queryConverter(compiledModel, params);
  /* INFO] 쿼리 debug시 주석 해제 */
  console.log(compiledModel);
  console.log(convertedSql);
  try {
    const result = await conn.query(convertedSql);
    return result['rows']
  } catch (error) {
    throw new InternalServerError(error, DBError.code);
  }
};

type QueryReducerArray = [string, any[], number];
const queryConverter = function(parameterizedSql: string, params: any) {
  if (params) {
    const [text, values] = Object.entries(params).reduce(
      ([sql, array, index], [key, value]) => {
        if (value !== undefined && value != null && sql.indexOf(`\${${key}}`) != -1) {
          sql = replaceAll(sql, `\${${key}}`, `$${index}`);
          array.push(value);
          index += 1;
        }
        return [sql, array, index] as QueryReducerArray
      },
      [parameterizedSql, [], 1] as QueryReducerArray
    );
    return { text, values };
  }
  return parameterizedSql
}

const beginTransaction = async function(conn: PoolClient) {
  await conn.query('BEGIN');
}

const commit = async function(conn: PoolClient) {
  await conn.query('COMMIT');
}

const rollBack = async function(conn: PoolClient) {
  await conn.query('ROLLBACK');
}

export { // TODO] 여기 함수들 Models.ts 로 넣는게 어떨지?
  getConnection,
  release,
  execute,
  beginTransaction,
  commit,
  rollBack,
};
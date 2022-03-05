import handlebars from 'handlebars';
import { getPool } from '../../init';
import { InternalServerError } from '../error/errors';
import { DBError } from '../error/errorCodes';
import { replaceAll } from '../common/commonFunc';

const getConnection = async function() {
  try {
    const pool: any = await getPool();
    const conn = await pool.connect();
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

const execute = async function(conn: any, sql: string, params: any) {
  const preCompiledModel = compileSQL(sql);
  const compiledModel = preCompiledModel(params);
  const convertedSql = queryConverter(compiledModel, params);
  /* 쿼리 debug시 주석 해제 */
  // console.log(compiledModel);
  // console.log(convertedSql);
  try {
    const result = await conn.query(convertedSql); // TODO] SQL인젝션 방지목적 preparedStatement 필요
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
        sql = replaceAll(sql, `\${${key}}`, `$${index}`);
        if (value !== undefined) {
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
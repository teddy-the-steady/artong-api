import axios from 'axios';
import { BadRequest } from '../error/errors';

const graphqlRequest = async function(body: any) {
  const result = await axios({
    url: '/query/36284/artong-test/v0.0.20',
    baseURL: 'https://api.studio.thegraph.com',
    method: 'POST',
    data: body
  });

  if (result.status === 200 && result.data.errors) {
    throw new BadRequest(result.data.errors, null)
  }

  return result.data.data
}

const parseGraphqlQuery = function(query: string): string {
  return remove_db_dataFromGraphqlQuery(query);
}

const remove_db_dataFromGraphqlQuery = function(query: string): string {
  const regexp = /_db_\w+/g;
  return query.replace(regexp, '');
}

const parse_db_data = function(query: string): string[] {
  const _db_dataArray = get_db_ArrayFromGraphqlQuery(query);
  const result = remove_db_prefixFromDataArray(_db_dataArray)
  return result || []
}

const get_db_ArrayFromGraphqlQuery = function(query: string): RegExpMatchArray | null {
  const regexp = /_db_\w+/g;
  return query.match(regexp);
}

const remove_db_prefixFromDataArray = function(_db_dataArray: RegExpMatchArray | null): string[] {
  if (!_db_dataArray) {
    return []
  }
  return _db_dataArray?.map(data => data.substring(4));
}

export {
  graphqlRequest,
  parseGraphqlQuery,
  parse_db_data,
}
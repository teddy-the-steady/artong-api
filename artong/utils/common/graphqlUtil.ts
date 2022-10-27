import axios from 'axios';

const graphqlRequest = async function(body: any) {
  const result = await axios({
    url: '/query/36284/artong-test/v0.0.15',
    baseURL: 'https://api.studio.thegraph.com',
    method: 'POST',
    data: body
  });

  return result.data.data
}

const parseGraphqlQuery = function(query: string): string {
  return remove_db_dataFromGraphqlQuery(query);
}

const remove_db_dataFromGraphqlQuery = function(query: string): string {
  const regexp = /_db_\w+/g;
  return query.replace(regexp, '');
}

const parse_db_data = function(query: string) {
  return get_db_ArrayFromGraphqlQuery(query);
}

const get_db_ArrayFromGraphqlQuery = function(query: string): RegExpMatchArray | null {
  const regexp = /_db_\w+/g;
  return query.match(regexp);
}

export {
  graphqlRequest,
  parseGraphqlQuery,
  parse_db_data,
}
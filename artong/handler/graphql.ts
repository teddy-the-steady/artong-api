import { parse } from 'graphql';
import { Member } from '../models';
import { BadRequest } from '../utils/error/errors';
import { projects } from '../controllers/artong';
import { graphqlRequest, parseGraphqlQuery, parse_db_data } from '../utils/common/graphqlUtil';

const graphql = async function(body: any, member: Member) {
  const parsed = parse(body.query);
  const queryName = (parsed.definitions[0] as any).name.value;

  const pureQuery = parseGraphqlQuery(body.query);
  const _db_ = parse_db_data(body.query);
  const isDataMergeNecessary = _db_.length > 0;

  let result: any;
  if (isDataMergeNecessary) {
    switch (queryName) {
      case 'Project': result = await projects.queryProject(body, _db_, pureQuery);
        break;
      case 'Projects': result = await projects.queryProjects(body, _db_, pureQuery);
        break;
      default:
        throw new BadRequest('query name undefined', null);
    }
  } else {
    result = await graphqlRequest({query: pureQuery});
  }

  return result
}

export {
	graphql,
};
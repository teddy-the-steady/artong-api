import { parse } from 'graphql';
import { Member } from '../models';
import { BadRequest } from '../utils/error/errors';
import { projects, contents, offers } from '../controllers/artong';
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
      case 'ProjectsByCreator': result = await projects.queryProjectsByCreator(body, _db_, pureQuery);
        break;
      case 'Token': result = await contents.queryToken(body, _db_, pureQuery);
        break;
      case 'Tokens': result = await contents.queryTokens(body, _db_, pureQuery);
        break;
      case 'TokensByProject': result = await contents.queryTokensByProject(body, _db_, pureQuery);
        break;
      case 'TokensByCreator': result = await contents.queryTokensByCreator(body, _db_, pureQuery);
        break;
      case 'TokensByOwner': result = await contents.queryTokensByOwner(body, _db_, pureQuery);
        break;
      case 'OffersByToken': result = await offers.queryOffersByToken(body, _db_, pureQuery);
        break;
      default:
        throw new BadRequest('query name undefined', null);
    }
  } else {
    result = {data: await graphqlRequest({query: pureQuery, variables: body.variables})};
  }

  return result
}

export {
	graphql,
};
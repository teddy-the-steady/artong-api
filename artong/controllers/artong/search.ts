import { Projects } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { PoolClient } from 'pg';
import _ from 'lodash';
import { graphqlRequest } from '../../utils/common/graphqlUtil';

const querySearch = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.projects.length === 0) {
      return {data: {projects: []}}
    }

    const projectModel = new Projects({}, conn);
    const extractedProjectIds = gqlResult.projects.map((project: { id: string; }) => project.id);

    const dbResult = await projectModel.getProjectsWithAddressArray(extractedProjectIds, _db_);

    if (dbResult && gqlResult.projects) {
      const merged = _.merge(_.keyBy(gqlResult.projects, 'id'), _.keyBy(dbResult, 'id'))
      return {data: {projects: _.values(merged)}}
    } else {
      return {data: gqlResult}
    }
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
  querySearch,
};
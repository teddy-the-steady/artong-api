import { Member, Projects } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
import { isAddress } from '../../utils/common/commonFunc';
import { PoolClient } from 'pg';
import _ from 'lodash';

interface QueryOffersByTokenInfo {
  variables: {
    id: string
    project_address: string
    token_id: number
    first: number
    skip: number
  }
}
const queryOffersByToken = async function(body: QueryOffersByTokenInfo, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
    if (!isAddress(body.variables.project_address)) {
      const projectModel = new Projects({}, conn);
      const projectResult = await projectModel.getProjectWithAddressOrSlug(body.variables.project_address);
      if (!projectResult || !projectResult.address) return {data: {token: {}}}
      body.variables.project_address = projectResult.address;
      body.variables.id = projectResult.address + body.variables.token_id;
    }

    const gqlResult = await graphqlRequest({query: pureQuery, variables: body.variables});
    if (gqlResult.offers.length === 0) {
      return {data: {offers: []}}
    }

    const memberModel = new Member({}, conn);
    gqlResult.offers = await memberModel.setSenderFromMemberListTo(gqlResult.offers);

    return {data: gqlResult}
  } catch (error) {
    throw controllerErrorWrapper(error);
  } finally {
    db.release(conn);
  }
}

export {
	queryOffersByToken,
};
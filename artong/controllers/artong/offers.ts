import { Member } from '../../models/index';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import * as db from '../../utils/db/db';
import { graphqlRequest } from '../../utils/common/graphqlUtil';
import { PoolClient } from 'pg';
import _ from 'lodash';

const queryOffersByToken = async function(body: any, _db_: string[], pureQuery: string) {
  const conn: PoolClient = await db.getConnection();

  try {
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
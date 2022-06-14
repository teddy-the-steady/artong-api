import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
const insertContentReactions = require('../../models/reactions/insertContentReactions.sql')

export default class ContentReactions {
	reaction_id?: number;
	content_id?: number;
	member_id?: number;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<ContentReactions>) {
		Object.assign(this, data);
	}

	async createContentReaction(
		reaction_id?: number,
		content_id?: number,
		member_id?: number
	): Promise<ContentReactions> {
		let conn: any;

		try {
			conn = await db.getConnection();
			const result = await db.execute(conn, insertContentReactions, {
				reaction_id: reaction_id,
				content_id: content_id,
				member_id: member_id
			});
			return result[0]
		} catch (error) {
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	}
}
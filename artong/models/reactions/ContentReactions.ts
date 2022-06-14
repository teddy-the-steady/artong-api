import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
const insertContentReactions = require('../../models/reactions/insertContentReactions.sql')

export default class ContentReactions {
	reaction_id: number | null;
	content_id: number | null;
	member_id: number | null;

	created_at: Date | null;
	updated_at: Date | null;

	constructor({
		reaction_id = null,
		content_id = null,
		member_id = null,
		created_at = null,
		updated_at = null
	} = {}) {
		this.reaction_id = reaction_id;
		this.content_id = content_id;
		this.member_id = member_id;

		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	async createContentReaction(
		reaction_id: number | null,
		content_id: number | null,
		member_id: number | null
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
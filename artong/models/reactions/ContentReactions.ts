import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import { ContentReactionsInfo } from '../../controllers/artong/reactions';
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

	async createContentReaction(contentReaction: ContentReactionsInfo): Promise<ContentReactions> {
		let conn: any;

		try {
			conn = await db.getConnection();
			await db.beginTransaction(conn);

			const result = await db.execute(conn, insertContentReactions, contentReaction);

			await db.commit(conn);

			return result[0]
		} catch (error) {
			if (conn) await db.rollBack(conn);
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	}
}
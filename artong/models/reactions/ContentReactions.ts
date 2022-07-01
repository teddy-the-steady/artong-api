import { Client } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertContentReactions = require('../../models/reactions/insertContentReactions.sql')

export default class ContentReactions extends Models {
	reaction_id?: number;
	content_id?: number;
	member_id?: number;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<ContentReactions> = {}, conn: Client) {
		super(conn);
		Object.assign(this, data);
	}

	async createContentReaction(
		reaction_id?: number,
		content_id?: number,
		member_id?: number
	): Promise<ContentReactions> {
		try {
			const result = await db.execute(this.conn, insertContentReactions, {
				reaction_id: reaction_id,
				content_id: content_id,
				member_id: member_id
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}
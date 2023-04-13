import { PoolClient } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
import { IsDate, IsInt, IsOptional } from 'class-validator';
const insertContentReactions = require('./insertContentReactions.sql')
const selectTotalLikesByContent = require('./selectTotalLikesByContent.sql')

class ContentReactions extends Models {
	@IsInt()
	reaction_id!: number;
	@IsInt()
	content_id!: number;
	@IsInt()
	member_id!: number;
	@IsDate()
	created_at!: Date;
	@IsDate()
	@IsOptional()
	updated_at?: Date;

	constructor(data: Partial<ContentReactions> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async createContentReaction(
		reaction_code: string,
		content_id: number,
		member_id: number
	): Promise<ContentReactions> {
		try {
			const result = await db.execute(this.conn, insertContentReactions, {
				reaction_code,
				content_id,
				member_id
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getTotalLikesByContent(
		content_id: number,
	): Promise<{ total_likes: string }> {
		try {
			const result = await db.execute(this.conn, selectTotalLikesByContent, {
				content_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	ContentReactions,
}
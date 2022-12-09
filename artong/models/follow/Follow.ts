import * as db from '../../utils/db/db';
import Models from '../Models';
import { PoolClient } from 'pg';
const insertFollow = require('./insertFollow.sql');
const deleteFollow = require('./deleteFollow.sql');

class Follow extends Models {
	followee_id?: number;
	follower_id?: number;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Follow> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async createFollow(
		followee_id?: number,
		follower_id?: number,
	): Promise<Follow> {
		try {
			const result = await db.execute(this.conn, insertFollow, {
				followee_id,
				follower_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async deleteFollow(
		followee_id?: number,
		follower_id?: number,
	): Promise<Follow> {
		try {
			const result = await db.execute(this.conn, deleteFollow, {
				followee_id,
				follower_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	Follow,
}
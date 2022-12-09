import * as db from '../../utils/db/db';
import Models from '../Models';
import { PoolClient } from 'pg';
const insertSubscribe = require('./insertSubscribe.sql');
const deleteSubscribe = require('./deleteSubscribe.sql');

class Subscribe extends Models {
	member_id?: number;
	project_address?: string;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Subscribe> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async createSubscribe(
		member_id?: number,
		project_address?: string,
	): Promise<Subscribe> {
		try {
			const result = await db.execute(this.conn, insertSubscribe, {
				member_id,
				project_address,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async deleteSubscribe(
		member_id?: number,
		project_address?: string,
	): Promise<Subscribe> {
		try {
			const result = await db.execute(this.conn, deleteSubscribe, {
				member_id,
				project_address,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	Subscribe,
}
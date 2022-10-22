import { PoolClient } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertContent = require('./insertContent.sql');
const updateContent = require('./updateContent.sql');
const selectContent = require('./selectContent.sql');

class Contents extends Models {
	id?: number;
	member_id?: number;
	project_address?: string;
	token_id?: number;
	content_s3key?: string;
	ipfs_url?: string;
	name?: string;
	description?: string;
	voucher?: object;
	is_redeemed?: boolean;

	content_url?: string;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Contents> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async createContent(
		member_id?: number,
		project_address?: string,
		content_s3key?: string,
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, insertContent, {
				member_id,
				project_address,
				content_s3key,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async updateContent(
		id?: number,
		ipfs_url?: string,
		token_id?: number,
		voucher?: object,
		is_redeemed?: boolean,
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, updateContent, {
				id,
				ipfs_url,
				token_id,
				voucher,
				is_redeemed,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getContent(id?: number): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, selectContent, { id });
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	Contents,
}
import { Client } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertContent = require('./insertContent.sql');
const updateContent = require('./updateContent.sql');

class Contents extends Models {
	id?: number;
	member_id?: number;
	project_address?: string;
	token_id?: number;
	content_url?: string;
	ipfs_url?: string;
	name?: string;
	description?: string;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Contents> = {}, conn: Client) {
		super(conn);
		Object.assign(this, data);
	}

	async createContent(
		member_id?: number,
		project_address?: string,
		content_url?: string,
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, insertContent, {
				member_id,
				project_address,
				content_url,
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
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, updateContent, {
				id,
				ipfs_url,
				token_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	Contents,
}
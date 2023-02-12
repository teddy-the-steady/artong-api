import { PoolClient } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertReport = require('./insertReport.sql')

class Reports extends Models {
	id?: number;
	member_id?: number;
	description?: string;
	category?: string;
	project_address?: string;
	contents_id?: number;
	member_id_reported?: number;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Reports> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async createReport(
		description?: string,
		project_address?: string,
		contents_id?: number,
		member_id_reported?: number,
		category?: string,
		member_id?: number,
	): Promise<Reports> {
		try {
			const result = await db.execute(this.conn, insertReport, {
				description,
				project_address,
				contents_id,
				member_id_reported,
				category,
				member_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	Reports,
}
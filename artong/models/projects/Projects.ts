import { Client } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertProject = require('./insertProject.sql');

class Projects extends Models {
	address?: string;
	member_id?: number;
	name?: string;
	description?: string;
	thumbnail_url?: string;
	background_url?: string;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Projects> = {}, conn: Client) {
		super(conn);
		Object.assign(this, data);
	}

	async createProject(
		address?: string,
		member_id?: number,
    name?: string
	): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, insertProject, {
				address,
				member_id,
				name
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	Projects,
}
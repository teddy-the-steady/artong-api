import { Client } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertProject = require('./insertProject.sql');
const updateProject = require('./updateProject.sql');
const getProject = require('./selectProject.sql');
const getProjects = require('./selectProjects.sql');


class Projects extends Models {
	create_tx_hash?: string;
	address?: string;
	member_id?: number;
	name?: string;
	description?: string;
	project_s3key?: string;
	project_thumbnail_s3key?: string;
	background_s3key?: string;
	background_thumbnail_s3key?: string;
	status?: string;
	symbol?: string;

	created_at?: Date;
	updated_at?: Date;

	policy?: number; // on-chain data

	constructor(data: Partial<Projects> = {}, conn: Client) {
		super(conn);
		Object.assign(this, data);
	}

	async createProject(
		create_tx_hash?: string,
		member_id?: number,
    name?: string,
		symbol?: string,
		status?: string
	): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, insertProject, {
				create_tx_hash,
				member_id,
				name,
				symbol,
				status
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async updateProject(
		create_tx_hash?: string,
		address?: string,
		member_id?: number,
		description?: string,
    project_s3key?: string,
    background_s3key?: string,
		status?: string
	): Promise<Projects>  {
		try {
			const result = await db.execute(this.conn, updateProject, {
				create_tx_hash,
				address,
				member_id,
				description,
				project_s3key,
				background_s3key,
				status
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getProjectWithTxhash(create_tx_hash?: string): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, getProject, {
				create_tx_hash
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getProjectWithAddress(address?: string): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, getProject, {
				address
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getProjects(
		member_id?: number,
		status?: string,
		start_num?: number,
		count_num?: number
	): Promise<Projects[]> {
		try {
			const result = await db.execute(this.conn, getProjects, {
				member_id,
				status,
				start_num,
				count_num
			});
			return result
		} catch (error) {
			throw error;
		}
	}
}

export {
	Projects,
}
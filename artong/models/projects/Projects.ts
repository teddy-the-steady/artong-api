import { PoolClient } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
import { IsNotEthereumAddress } from '../../utils/validators/IsNotEthereumAddress';
const insertProject = require('./insertProject.sql');
const insertProjects = require('./insertProjects.sql');
const updateProject = require('./updateProject.sql');
const selectProject = require('./selectProject.sql');
const selectProjectsPrevNext = require('./selectProjectsPrevNext.sql');
const selectProjectsWithAddressArray = require('./selectProjectsWithAddressArray.sql');
const selectProjectsWithTxHashArray = require('./selectProjectsWithTxHashArray.sql');
const selectProjectsByCreatorWithAddressArray = require('./selectProjectsByCreatorWithAddressArray.sql');
const selectProjectsByCreatorWithTxHashArray = require('./selectProjectsByCreatorWithTxHashArray.sql');
const selectProjectsLikeName = require('./selectProjectsLikeName.sql');
const selectSubscribedProjectsByMember = require('./selectSubscribedProjectsByMember.sql');
const updateProjectThumbnailS3keys = require('./updateProjectThumbnailS3keys.sql');
const updateProjectAddressAndStatus = require('./updateProjectAddressAndStatus.sql');

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
	sns?: object;
	@IsNotEthereumAddress()
	slug?: string;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Projects> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async createProject(
		create_tx_hash?: string,
		member_id?: number,
    	name?: string,
		symbol?: string,
		status?: string,
		project_s3key?: string,
		background_s3key?: string,
	): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, insertProject, {
				create_tx_hash,
				member_id,
				name,
				symbol,
				status,
				project_s3key,
				background_s3key,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async createProjects(
		projects?: Projects[],
	): Promise<Projects[]> {
		try {
			const result = await db.execute(this.conn, insertProjects, {
				projects,
			});
			return result
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
		status?: string,
		sns?: object,
		slug?: string,
	): Promise<Projects>  {
		try {
			const result = await db.execute(this.conn, updateProject, {
				create_tx_hash,
				address,
				member_id,
				description,
				project_s3key,
				background_s3key,
				status,
				sns,
				slug,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async updateProjectAddressAndStatus(
		create_tx_hash?: string,
		address?: string,
		status?: string,
	): Promise<Projects>  {
		try {
			const result = await db.execute(this.conn, updateProjectAddressAndStatus, {
				create_tx_hash,
				address,
				status,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getProjectWithTxhash(create_tx_hash?: string): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, selectProject, {
				create_tx_hash
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getProjectWithAddressOrSlug(
		addressOrSlug?: string,
		member_id?: number,
	): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, selectProject, {
				addressOrSlug,
				member_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getProjectsPrevNext(
		address?: string,
		prev_next_count?: number
	): Promise<Projects[]> {
		try {
			const result = await db.execute(this.conn, selectProjectsPrevNext, {
				address,
				prev_next_count,
			});
			return result
		} catch (error) {
			throw error;
		}
	}

	async getProjectsWithAddressArray(addressArray?: Array<string>, _db_?: string[]): Promise<Projects[]> {
		try {
			const result = await db.execute(
				this.conn,
				selectProjectsWithAddressArray,
				{addressArray, _db_}
			);
			return result
		} catch (error) {
			throw error;
		}
	}

	async getProjectsWithTxHashArray(txHashArray?: Array<string>, _db_?: string[]): Promise<Projects[]> {
		try {
			const result = await db.execute(
				this.conn,
				selectProjectsWithTxHashArray,
				{txHashArray, _db_}
			);
			return result
		} catch (error) {
			throw error;
		}
	}

	async getProjectsByCreatorWithAddressArray(
		addressArray?: Array<string>,
		address?: string,
		_db_?: string[]
	): Promise<Projects[]> {
		try {
			const result = await db.execute(
				this.conn,
				selectProjectsByCreatorWithAddressArray,
				{addressArray, address, _db_}
			);
			return result
		} catch (error) {
			throw error;
		}
	}

	async getProjectsByCreatorWithTxHashArray(
		txHashArray?: Array<string>,
		address?: string,
		_db_?: string[]
	): Promise<Projects[]> {
		try {
			const result = await db.execute(
				this.conn,
				selectProjectsByCreatorWithTxHashArray,
				{txHashArray, address, _db_}
			);
			return result
		} catch (error) {
			throw error;
		}
	}

	async searchProjects(name?: string): Promise<Projects[]> {
		try {
			const result = await db.execute(this.conn, selectProjectsLikeName, {
				name
			});
			return result
		} catch (error) {
			throw error;
		}
	}

	async getMemberSubscribedProjects(
		member_id?: number,
		start_num?: number,
		count_num?: number,
	): Promise<Projects[]> {
		try {
			const result = await db.execute(this.conn, selectSubscribedProjectsByMember, {
				member_id,
				start_num,
				count_num,
			});
			return result
		} catch (error) {
			throw error;
		}
	}

	async updateProjectThumbnailS3keys(
		project_s3key?: string,
		project_thumbnail_s3key?: string,
		background_s3key?: string,
		background_thumbnail_s3key?: string,
	): Promise<Projects> {
		try {
			const result = await db.execute(this.conn, updateProjectThumbnailS3keys, {
				project_s3key,
				project_thumbnail_s3key,
				background_s3key,
				background_thumbnail_s3key,
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
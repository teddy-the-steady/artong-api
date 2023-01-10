import _ from 'lodash';
import { PoolClient } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertContent = require('./insertContent.sql');
const updateContent = require('./updateContent.sql');
const updateContentThumbnailS3keys = require('./updateContentThumbnailS3keys.sql');
const updateContentTokenIds = require('./updateContentTokenIds.sql');
const selectContent = require('./selectContent.sql');
const selectContentById = require('./selectContentById.sql');
const selectMintReadyContents = require('./selectMintReadyContents.sql');
const selectContentsWithTokenIdArray = require('./selectContentsWithTokenIdArray.sql');
const selectContentsByProjectWithTokenIdArray = require('./selectContentsByProjectWithTokenIdArray.sql');
const selectContentsByCreatorWithTokenIdArray = require('./selectContentsByCreatorWithTokenIdArray.sql');
const selectContentVoucherById = require('./selectContentVoucherById.sql');
const selectContentsLikeName = require('./selectContentsLikeName.sql');

class Contents extends Models {
	id?: number;
	member_id?: number;
	project_address?: string;
	token_id?: number;
	content_s3key?: string;
	content_thumbnail_s3key?: string;
	ipfs_url?: string;
	name?: string;
	description?: string;
	voucher?: object;
	is_redeemed?: boolean;
	status?: string;

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
		name?: string,
		description?: string,
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, updateContent, {
				id,
				ipfs_url,
				token_id,
				voucher,
				is_redeemed,
				name,
				description,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getContent(
		project_address?: string,
		token_id?: number
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, selectContent, {
				project_address,
				token_id
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getContentById(
		project_address?: string,
		id?: number,
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, selectContentById, {
				project_address,
				id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getTokensWithIdArray(
		idArray?: Array<number>,
		_db_?: string[]
	): Promise<Contents[]> {
		try {
			if (_db_) { // INFO] voucher는 보안상 getContent에서 is_redeemd = False 일때만 제공
				const idx = _db_.indexOf('voucher')
				if (idx > -1) _db_.splice(idx, 1)
			}

			const result = await db.execute(
				this.conn,
				selectContentsWithTokenIdArray,
				{idArray, _db_}
			);
			return result
		} catch (error) {
			throw error;
		}
	}

	async getTokensByProjectWithIdArray(
		tokenIdArray?: Array<number>,
		project_address?: string,
		_db_?: string[]
	): Promise<Contents[]> {
		try {
			if (_db_) {
				const idx = _db_.indexOf('voucher')
				if (idx > -1) _db_.splice(idx, 1)
			}

			const result = await db.execute(
				this.conn,
				selectContentsByProjectWithTokenIdArray,
				{tokenIdArray, project_address, _db_}
			);

			return result
		} catch (error) {
			throw error;
		}
	}

	async updateContentThumbnailS3keys(
		content_s3key?: string,
		content_thumbnail_s3key?: string,
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, updateContentThumbnailS3keys, {
				content_s3key,
				content_thumbnail_s3key
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getMintReadyContents(
		project_address?: string,
		start_num?: number,
		count_num?: number
	): Promise<Contents[]> {
		try {
			const result = await db.execute(this.conn, selectMintReadyContents, {
				project_address: project_address,
				start_num: start_num,
				count_num: count_num
			});
			return result
		} catch (error) {
			throw error;
		}
	}

	async getContentVoucherById(
		id?: number,
		member_id?: number,
	): Promise<Contents> {
		try {
			const result = await db.execute(this.conn, selectContentVoucherById, {
				id: id,
				member_id: member_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getTokensByCreatorWithIdArray(
		subgraphTokenIdArray?: Array<string>,
		creator?: string,
		_db_?: string[]
	): Promise<Contents[]> {
		try {
			if (_db_) {
				const idx = _db_.indexOf('voucher')
				if (idx > -1) _db_.splice(idx, 1)
			}

			const result = await db.execute(
				this.conn,
				selectContentsByCreatorWithTokenIdArray,
				{subgraphTokenIdArray, creator, _db_}
			);

			return result
		} catch (error) {
			throw error;
		}
	}

	async searchContents(
		name?: string,
	): Promise<Contents[]> {
		try {
			const result = await db.execute(this.conn, selectContentsLikeName, {
				name
			});
			return result
		} catch (error) {
			throw error;
		}
	}

	async updateContentTokenIds(
		contents?: any[],
	): Promise<Contents[]> {
		try {
			const result = await db.execute(this.conn, updateContentTokenIds, {
				contents
			});
			return result
		} catch (error) {
			throw error;
		}
	}
}

export {
	Contents,
}
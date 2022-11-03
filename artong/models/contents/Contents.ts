import _ from 'lodash';
import { PoolClient } from 'pg';
import * as db from '../../utils/db/db';
import { Member } from '../member/Member';
import Models from '../Models';
const insertContent = require('./insertContent.sql');
const updateContent = require('./updateContent.sql');
const updateContentThumbnailS3keys = require('./updateContentThumbnailS3keys.sql');
const selectContent = require('./selectContent.sql');
const selectContentsWithTokenIdArray = require('./selectContentsWithTokenIdArray.sql');
const selectContentsByProjectWithTokenIdArray = require('./selectContentsByProjectWithTokenIdArray.sql');

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

	created_at?: Date;
	updated_at?: Date;

	tokenIdArray?: Array<number>;
	projectAddressArray?: Array<string>;

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

	async getTokensWithIdArray(
		tokenIdArray?: Array<number>,
		projectAddressArray?: Array<string>,
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
				{tokenIdArray, projectAddressArray, _db_}
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
	): Promise<Member> {
		try {
			const result = await db.execute(this.conn, updateContentThumbnailS3keys, {
				content_s3key: content_s3key,
				content_thumbnail_s3key: content_thumbnail_s3key
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	};
}

export {
	Contents,
}
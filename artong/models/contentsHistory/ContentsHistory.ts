import { PoolClient } from 'pg';
import Models from '../Models';
import * as db from '../../utils/db/db';
const selectContentsHistory = require('./selectContentsHistory.sql');
const selectContentsHistories = require('./selectContentsHistories.sql');
const insertContentsHistories = require('./insertContentsHistories.sql');

class ContentsHistory extends Models {
	id?: number;
    contents_id?: number;
	from_member_id?: number;
    to_member_id?: number;
    history_type?: string;
    subgraph_raw?: object;
    tx_hash?: string;
    block_timestamp?: string;

	created_at?: Date;

	constructor(data: Partial<ContentsHistory> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

    async getLatestContentsHistory(
        project_address?: string,
        token_id?: string,
    ): Promise<ContentsHistory> {
        try {
			const result = await db.execute(this.conn, selectContentsHistory, {
				project_address,
                token_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
    }

	async createContentsHistories(
		histories?: any[],
		project_address?: string,
		token_id?: string,
	): Promise<ContentsHistory[]> {
		try {
			const result = await db.execute(this.conn, insertContentsHistories, {
				histories,
				project_address,
				token_id,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getContentsHistories(
		project_address?: string,
		token_id?: string,
		start_num?: number,
		count_num?: number,
	): Promise<ContentsHistory[]> {
		try {
			const result = await db.execute(this.conn, selectContentsHistories, {
				project_address,
				token_id,
				start_num,
				count_num,
			});
			return result
		} catch (error) {
			throw error;
		}
	}
}

export {
	ContentsHistory,
}
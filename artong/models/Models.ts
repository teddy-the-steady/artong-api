import { PoolClient } from 'pg';

export default class Models {
	conn: PoolClient;

	constructor(conn: PoolClient) {
		this.conn = conn;
	}
}
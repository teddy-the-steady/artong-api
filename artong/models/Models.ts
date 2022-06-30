import { Client } from 'pg';

export default class Models {
	conn?: Client;

	constructor(conn?: Client) {
		this.conn = conn;
	}
}
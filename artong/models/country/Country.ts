import { Client } from 'pg';
import * as db from '../../utils/db/db';
import Models from '../Models';
const insertCountry = require('./insertCountry.sql');

class Country extends Models {
	id?: number;
	iso_code_3?: string;
	iso_code_2?: string;
	name?: string;
	number_code?: string;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Country> = {}, conn: Client) {
		super(conn);
		Object.assign(this, data);
	}

	async createCountry(
		iso_code_3?: string,
    iso_code_2?: string,
    name?: string,
    number_code?: string
	): Promise<Country> {
		try {
			const result = await db.execute(this.conn, insertCountry, {
				iso_code_3,
				iso_code_2,
				name,
				number_code
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}
}

export {
	Country,
}
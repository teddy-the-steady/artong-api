import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
import Models from '../Models';
const insertCountry = require('../../models/country/insertCountry.sql');

class Country extends Models {
	id?: number;
	iso_code_3?: string;
	iso_code_2?: string;
	name?: string;
	number_code?: string;

	created_at?: Date;
	updated_at?: Date;

	constructor(data: Partial<Country> = {}) {
		super(data.conn)
		Object.assign(this, data);
	}

	async createCountry(
		iso_code_3?: string,
    iso_code_2?: string,
    name?: string,
    number_code?: string
	): Promise<Country> {
		let conn: any;

		try {
			conn = await db.getConnection();
			const result = await db.execute(conn, insertCountry, {
				iso_code_3,
				iso_code_2,
				name,
				number_code
			});
			return result[0]
		} catch (error) {
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	}
}

export {
	Country,
}
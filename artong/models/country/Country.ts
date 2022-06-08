import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
const insertCountry = require('../../models/country/insertCountry.sql');

interface CountryInfo {
  iso_code_3: string;
	iso_code_2: string;
	name: string;
	number_code: string;
}

export default class Country {
	id: number | null;
	iso_code_3: string | null;
	iso_code_2: string | null;
	name: string | null;
	number_code: string | null;

	created_at: Date | null;
	updated_at: Date | null;

	constructor({
		id = null,
		iso_code_3 = null,
		iso_code_2 = null,
		name = null,
		number_code = null,
		created_at = null,
		updated_at = null
	} = {}) {
		this.id = id;
		this.iso_code_3 = iso_code_3;
		this.iso_code_2 = iso_code_2;
		this.name = name;
		this.number_code = number_code;

		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	async createCountry(country: CountryInfo): Promise<Country> {
		let conn: any;

		try {
			conn = await db.getConnection();
			await db.beginTransaction(conn);

			const result = await db.execute(conn, insertCountry, country);

			await db.commit(conn);

			return result[0]
		} catch (error) {
			if (conn) await db.rollBack(conn);
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	}
}
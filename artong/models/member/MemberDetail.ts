import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export default class MemberDetail {
	id: number;
	@Type(() => Number)
	@IsNumber()
	member_id: number;
	given_name: string;
	family_name: string;
	zip_code: number;
	address: string;
	adress_detail: string;
	birthday: Date;
	introduction: string;
	profile_pic: string;
	phone_number: string;
	country_id: number;
	language_id: number;
	last_activity_at: Date;

	created_at: Date;
	updated_at: Date;

	constructor(
		id: number,
		member_id: number,
		given_name: string,
		family_name: string,
		zip_code: number,
		address: string,
		adress_detail: string,
		birthday: Date,
		introduction: string,
		profile_pic: string,
		phone_number: string,
		country_id: number,
		language_id: number,
		last_activity_at: Date,
		created_at: Date,
		updated_at: Date,
	) {
		this.id = id;
		this.member_id = member_id;
		this.given_name = given_name;
		this.family_name = family_name;
		this.zip_code = zip_code;
		this.address = address;
		this.adress_detail = adress_detail;
		this.birthday = birthday;
		this.introduction = introduction;
		this.profile_pic = profile_pic;
		this.phone_number = phone_number;
		this.country_id = country_id;
		this.language_id = language_id;
		this.last_activity_at = last_activity_at;

		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}
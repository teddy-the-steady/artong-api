import {
  IsEmail,
  IsUUID,
} from 'class-validator';

export default class Member {
	id: number;
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
	country_iso_code: string;
	language: string;

	created_at: Date = new Date();
	updated_at: Date = new Date();

	constructor(obj: any) {
		this.id = obj.id;
		this.member_id = obj.member_id;
		this.given_name = obj.given_name;
		this.family_name = obj.family_name;
		this.zip_code = obj.zip_code;
		this.address = obj.address;
		this.adress_detail = obj.adress_detail;
		this.birthday = obj.birthday;
		this.introduction = obj.introduction;
		this.profile_pic = obj.profile_pic;
		this.phone_number = obj.phone_number;
		this.country_iso_code = obj.country_iso_code;
		this.language = obj.language;

		this.created_at = obj.created_at;
		this.updated_at = obj.updated_at;
	}
}
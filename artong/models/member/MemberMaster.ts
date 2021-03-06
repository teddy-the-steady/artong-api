import {
  IsEmail,
  IsUUID,
} from 'class-validator';
import MemberDetail from '../member/MemberDetail';

export default class MemberMaster {
	id: number;
	@IsEmail()
	email: string;
	username: string;
	@IsUUID('all')
	auth_id: string;
	status_id: number;
	is_email_verified: boolean;

	created_at: Date;
	updated_at: Date;

	constructor(obj: any) {
		this.id = obj.id;
		this.email = obj.email;
		this.username = obj.username;
		this.auth_id = obj.auth_id;
		this.status_id = obj.status_id;
		this.is_email_verified = obj.is_email_verified;

		this.created_at = obj.created_at;
		this.updated_at = obj.updated_at;
	}

	pourObjectIntoMemberMaster(object: any) {
		return Object.assign(this, object);
	}
}
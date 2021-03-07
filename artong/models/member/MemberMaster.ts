import { Type } from 'class-transformer';
import {
  IsEmail,
	IsNumber,
	IsOptional,
  IsUUID,
} from 'class-validator';

export default class MemberMaster {
	@Type(() => Number)
	@IsNumber()
	@IsOptional()
	id: number;
	@IsEmail()
	@IsOptional()
	email: string;
	username: string;
	@IsUUID('all')
	@IsOptional()
	auth_id: string;
	status_id: number;
	is_email_verified: boolean;

	created_at: Date;
	updated_at: Date;

	constructor(
		id: number,
		email: string,
		username: string,
		auth_id: string,
		status_id: number,
		is_email_verified: boolean,
		created_at: Date,
		updated_at: Date,
	) {
		this.id = id;
		this.email = email;
		this.username = username;
		this.auth_id = auth_id;
		this.status_id = status_id;
		this.is_email_verified = is_email_verified;

		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	pourObjectIntoMemberMaster(object: any) {
		return Object.assign(this, object);
	}
}
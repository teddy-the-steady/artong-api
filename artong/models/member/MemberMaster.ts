import {
  IsEmail,
  IsUUID,
} from 'class-validator';

export default class Member {
	id: number;
	@IsEmail()
	email: string;
	username: string;
	@IsUUID('all')
	auth_id: string;
	status_id: number;
	last_activity_at: Date = new Date();

	created_at: Date = new Date();
	updated_at: Date = new Date();

	constructor(obj: any) {
		this.id = obj.id;
		this.email = obj.email;
		this.username = obj.username;
		this.auth_id = obj.auth_id;
		this.status_id = obj.status_id;
		this.last_activity_at = obj.last_activity_at;

		this.created_at = obj.created_at;
		this.updated_at = obj.updated_at;
	}
}
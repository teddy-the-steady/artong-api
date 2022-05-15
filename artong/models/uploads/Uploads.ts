import {
    IsString,
  } from 'class-validator';

export default class Uploads {
    id: number;
    status_id: number;
    member_id: number;
    description: string;
    @IsString()
    thumbnail_url: string;

    @IsString()
    username: string;

    created_at: Date;
    updated_at: Date;

    constructor(obj: any) {
        this.id = obj.id;
        this.status_id = obj.status_id;
        this.member_id = obj.member_id;
        this.description = obj.description;
        this.thumbnail_url = obj.thumbnail_url;

        this.username = obj.username;

        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
    }

    pourObjectIntoUploads(object: any) {
		return Object.assign(this, object);
	}
}
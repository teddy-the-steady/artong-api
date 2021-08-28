export default class Uploads {
    id: number;
    status_id: number;
    privacy_bound_id: number;
    member_id: number;
    description: string;
    thumbnail_url: string;

    username: string;

    created_at: Date;
    updated_at: Date;

    constructor(obj: any) {
        this.id = obj.id;
        this.status_id = obj.status_id;
        this.privacy_bound_id = obj.privacy_bound_id;
        this.member_id = obj.member_id;
        this.description = obj.description;
        this.thumbnail_url = obj.thumbnail_url;

        this.username = obj.username;

        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
    }
}
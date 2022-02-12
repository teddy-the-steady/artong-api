export default class Contents {
    id: number;
    content_url: string;
    upload_id: number;

    created_at: Date;
    updated_at: Date;

    constructor(obj: any) {
        this.id = obj.id;
        this.content_url = obj.content_url;
        this.upload_id = obj.upload_id;

        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
    }
}
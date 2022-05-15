export default class UploadReactions {
    reaction_id: number;
    upload_id: number;
    member_id: number;

    created_at: Date;
    updated_at: Date;

    constructor(obj: any) {
        this.reaction_id = obj.reaction_id;
        this.upload_id = obj.upload_id;
        this.member_id = obj.member_id;

        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
    }
}
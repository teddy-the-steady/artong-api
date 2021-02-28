export default class Status {
    id: number;
    code: string;
    description: string;

    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(obj: any) {
        this.id = obj.id;
        this.code = obj.code;
        this.description = obj.description;

        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
    }
}
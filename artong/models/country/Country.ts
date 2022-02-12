export default class Country {
    id: number;
    iso_code_3: string;
    iso_code_2: string;
    name: string;
    number_code: string;

    created_at: Date;
    updated_at: Date;

    constructor(obj: any) {
        this.id = obj.id;
        this.iso_code_3 = obj.iso_code_3;
        this.iso_code_2 = obj.iso_code_2;
        this.name = obj.name;
        this.number_code = obj.number_code;

        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
    }
}
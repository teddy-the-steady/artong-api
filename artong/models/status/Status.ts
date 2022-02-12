import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export default class Status {
    @Type(() => Number)
    @IsNumber()
    id: number;
    code: string;
    description: string;

    created_at: Date;
    updated_at: Date;

    constructor(
        id: number,
        code: string,
        description: string,
        created_at: Date,
        updated_at: Date,
    ) {
        this.id = id;
        this.code = code;
        this.description = description;

        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
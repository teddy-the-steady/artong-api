export default class Test {
	id: number;
	name: string;
	value: number;
	created_at: string;

	constructor(obj: any) {
		this.id = obj.id;
		this.name = obj.name;
		this.value = obj.value;
		this.created_at = obj.created_at;
	}
}
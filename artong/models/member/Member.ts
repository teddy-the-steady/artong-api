class Member {
	private _id: number;
	private _email: string;
	private _username: string;
    private _auth_id: string;
    private _status_code: string;
    private _last_activity_at: Date;

    private _member_id: number;
    private _given_name: string;
    private _family_name: string;
    private _zip_code: number;
    private _address: string;
    private _adress_detail: string;
    private _birthday: Date;
    private _introduction: string;
    private _profile_pic: string;
    private _phone_number: string;
    private _country_iso_code: string;
    private _language: string;

    private _created_at: Date;
    private _updated_at: Date;

	constructor(obj: any) {
		this._id = obj.id;
		this._email = obj.email;
		this._username = obj.username;
		this._auth_id = obj.auth_id;
		this._status_code = obj.status_code;
		this._last_activity_at = obj.last_activity_at;

        this._member_id = obj.member_id;
        this._given_name = obj.given_name;
		this._family_name = obj.family_name;
        this._zip_code = obj.zip_code;
        this._address = obj.address;
        this._adress_detail = obj.adress_detail;
        this._birthday = obj.birthday;
        this._introduction = obj.introduction;
        this._profile_pic = obj.profile_pic;
        this._phone_number = obj.phone_number;
        this._country_iso_code = obj.country_iso_code;
        this._language = obj.language;

		this._created_at = obj.created_at;
		this._updated_at = obj.updated_at;
	}

    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    public get email(): string {
        return this._email;
    }

    public set email(email: string) {
        if (email.indexOf('@') === -1) return
        this._email = email;
    }

    public get username(): string {
        return this._username;
    }

    public set username(username: string) {
        this._username = username;
    }

    public get auth_id(): string {
        return this._auth_id;
    }

    public set auth_id(auth_id: string) {
        this._auth_id = auth_id;
    }

    public get status_code(): string {
        return this._status_code;
    }

    public set status_code(status_code: string) {
        this._status_code = status_code;
    }

    public get last_activity_at(): Date {
        return this._last_activity_at;
    }

    public set last_activity_at(last_activity_at: Date) {
        this._last_activity_at = last_activity_at;
    }

    public get member_id(): number {
        return this._member_id;
    }

    public set member_id(member_id: number) {
        this._member_id = member_id;
    }

    public get given_name(): string {
        return this._given_name;
    }

    public set given_name(given_name: string) {
        this._given_name = given_name;
    }

    public get family_name(): string {
        return this._family_name;
    }

    public set family_name(family_name: string) {
        this._family_name = family_name;
    }

    public get zip_code(): number {
        return this._zip_code;
    }

    public set zip_code(zip_code: number) {
        this._zip_code = zip_code;
    }

    public get address(): string {
        return this._address;
    }

    public set address(address: string) {
        this._address = address;
    }

    public get adress_detail(): string {
        return this._adress_detail;
    }

    public set adress_detail(adress_detail: string) {
        this._adress_detail = adress_detail;
    }

    public get birthday(): Date {
        return this._birthday;
    }

    public set birthday(birthday: Date) {
        this._birthday = birthday;
    }

    public get introduction(): string {
        return this._introduction;
    }

    public set introduction(introduction: string) {
        this._introduction = introduction;
    }

    public get profile_pic(): string {
        return this._profile_pic;
    }

    public set profile_pic(profile_pic: string) {
        this._profile_pic = profile_pic;
    }

    public get phone_number(): string {
        return this._phone_number;
    }

    public set phone_number(phone_number: string) {
        this._phone_number = phone_number;
    }

    public get country_iso_code(): string {
        return this._country_iso_code;
    }

    public set country_iso_code(country_iso_code: string) {
        this._country_iso_code = country_iso_code;
    }

    public get language(): string {
        return this._language;
    }

    public set language(language: string) {
        this._language = language;
    }

    public get created_at(): Date {
        return this._created_at;
    }

    public set created_at(created_at: Date) {
        this._created_at = created_at;
    }

    public get updated_at(): Date {
        return this._updated_at;
    }

    public set updated_at(updated_at: Date) {
        this._updated_at = updated_at;
    }
}

export = Member;
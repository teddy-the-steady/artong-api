import * as db from '../../utils/db/db';
import controllerErrorWrapper from '../../utils/error/errorWrapper';
const selectMember = require('../../models/member/selectMember.sql');
const selectMemberAuthId = require('../../models/member/selectMemberAuthId.sql');
const selectMembers = require('../../models/member/selectMembers.sql');
const insertMember = require('../../models/member/insertMember.sql');
const updateMemberProfilePic = require('../../models/member/updateMemberProfilePic.sql');

import {
	IsUUID,
	IsEmail,
	IsOptional,
} from 'class-validator'

interface MemberGroups {
	memberGroups: string[] | null;
}

class Member implements MemberGroups {
	id: number | null;
	@IsEmail()
	@IsOptional()
	email: string | null;
	username: string | null;
	@IsUUID()
	auth_id: string | null;
	introduction: string | null;
	profile_pic: string | null;
	country_id: number | null;

	created_at: Date | null;
	updated_at: Date | null;

	memberGroups: string[] | null;

	constructor({
		id = null,
		email = null,
		username = null,
		auth_id = null,
		introduction = null,
		profile_pic = null,
		country_id = null,
		created_at = null,
		updated_at = null,
		memberGroups = null,
	} = {}) {
		this.id = id;
		this.email = email;
		this.username = username;
		this.auth_id = auth_id;
		this.introduction = introduction,
		this.profile_pic = profile_pic,
		this.country_id = country_id,

		this.created_at = created_at;
		this.updated_at = updated_at;

		this.memberGroups = memberGroups;
	}

	async getMember(auth_id: string | null): Promise<Member> {
		let conn: any;

		try {
			conn = await db.getConnection();
			const result = await db.execute(conn, selectMember, { auth_id: auth_id });
			return result[0]
		} catch (error) {
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	}

	async getMemberAuthId(member_id: number | null): Promise<string> {
		let conn: any;

		try {
			conn = await db.getConnection();
			const result = await db.execute(conn, selectMemberAuthId, { member_id: member_id });
			return result[0].auth_id
		} catch (error) {
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	}

	async getMembers(username: string | null): Promise<Member[]> {
		let conn: any;
		let result: any;
	
		try {
			conn = await db.getConnection();
			result = await db.execute(conn, selectMembers, { username: username });
			return result
		} catch (error) {
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	};

	async createMember(
		auth_id: string | null,
		username: string | null,
		email: string | null
	): Promise<Member> {
		let conn: any;

		try {
			conn = await db.getConnection();
			const result = await db.execute(conn, insertMember, {
				auth_id: auth_id,
				username: username,
				email: email
			});
			return result[0]
		} catch (error) {
			if (conn) await db.rollBack(conn);
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	}

	async updateMemberProfilePic(
		id: number | null,
		profile_pic: string | null
	): Promise<Member> {
		let conn: any;
	
		try {
			conn = await db.getConnection();	
			const result = await db.execute(conn, updateMemberProfilePic, {
				id: id,
				profile_pic: profile_pic
			});
			return result[0]
		} catch (error) {
			if (conn) await db.rollBack(conn);
			throw controllerErrorWrapper(error);
		} finally {
			if (conn) db.release(conn);
		}
	};
}

export {
	Member,
}
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
	memberGroups?: string[];
}

class Member implements MemberGroups {
	id?: number;
	@IsEmail()
	@IsOptional()
	email?: string;
	username?: string;
	@IsUUID()
	auth_id?: string;
	introduction?: string;
	profile_pic?: string;
	country_id?: number;

	created_at?: Date;
	updated_at?: Date;

	memberGroups?: string[];

	constructor(data: Partial<Member> = {}) {
		Object.assign(this, data);
	}

	async getMember(auth_id?: string): Promise<Member> {
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

	async getMemberAuthId(member_id?: number): Promise<string> {
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

	async getMembers(username?: string): Promise<Member[]> {
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
		auth_id?: string,
		username?: string,
		email?: string
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
		id?: number,
		profile_pic?: string
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
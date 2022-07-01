import * as db from '../../utils/db/db';
import Models from '../Models';
const selectMember = require('../../models/member/selectMember.sql');
const selectMembers = require('../../models/member/selectMembers.sql');
const insertMember = require('../../models/member/insertMember.sql');
const updateMemberProfilePic = require('../../models/member/updateMemberProfilePic.sql');

import {
	IsEmail,
	IsOptional,
} from 'class-validator'
import { Client } from 'pg';

interface MemberGroups {
	memberGroups?: string[];
}

class Member extends Models implements MemberGroups {
	id?: number;
	@IsEmail()
	@IsOptional()
	email?: string;
	username?: string;
	wallet_address?: string;
	introduction?: string;
	profile_pic?: string;
	country_id?: number;

	created_at?: Date;
	updated_at?: Date;

	memberGroups?: string[];

	constructor(data: Partial<Member> = {}, conn: Client) {
		super(conn);
		Object.assign(this, data);
	}

	async getMember(id?: number, wallet_address?: string): Promise<Member> {
		try {
			const result = await db.execute(this.conn, selectMember, {
				id: id,
				wallet_address: wallet_address
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getMembers(username?: string): Promise<Member[]> {
		try {
			const result = await db.execute(this.conn, selectMembers, { username: username });
			return result
		} catch (error) {
			throw error;
		}
	};

	async createMember(
		username?: string,
		wallet_address?: string
	): Promise<Member> {
		try {
			const result = await db.execute(this.conn, insertMember, {
				username: username,
				wallet_address: wallet_address
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async updateMemberProfilePic(
		id?: number,
		profile_pic?: string
	): Promise<Member> {
		try {
			const result = await db.execute(this.conn, updateMemberProfilePic, {
				id: id,
				profile_pic: profile_pic
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	};
}

export {
	Member,
}
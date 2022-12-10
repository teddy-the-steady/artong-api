import * as db from '../../utils/db/db';
import Models from '../Models';
const selectMember = require('./selectMember.sql');
const selectMemberByUsername = require('./selectMemberByUsername.sql');
const insertMember = require('./insertMember.sql');
const updateMemberProfileS3keys = require('./updateMemberProfileS3keys.sql');
const selectMembersWithWalletAddressArray = require('./selectMembersWithWalletAddressArray.sql');
const updateMember = require('./updateMember.sql');
const selectMembersLikeName = require('./selectMembersLikeName.sql');
const selectProjectContributors = require('./selectProjectContributors.sql');
const selectFollower = require('./selectFollower.sql');
const selectFollowing = require('./selectFollowing.sql');

import {
	IsEmail,
	IsOptional,
	IsUUID,
	IsEthereumAddress
} from 'class-validator'
import { PoolClient } from 'pg';

interface MemberGroups {
	memberGroups?: string[];
}

class Member extends Models implements MemberGroups {
	id?: number;
	@IsEmail()
	@IsOptional()
	email?: string;
	username?: string;
	@IsEthereumAddress()
	@IsOptional()
	wallet_address?: string;
	introduction?: string;
	profile_s3key?: string;
	profile_thumbnail_s3key?: string;
	country_id?: number;
	@IsUUID()
	@IsOptional()
	principal_id?: string;

	created_at?: Date;
	updated_at?: Date;

	memberGroups?: string[];

	constructor(data: Partial<Member> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async getMember(id?: number, principal_id?: string): Promise<Member> {
		try {
			const result = await db.execute(this.conn, selectMember, {
				id,
				principal_id
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getMemberByUsername(username?: string): Promise<Member> {
		try {
			const result = await db.execute(this.conn, selectMemberByUsername, {
				username,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async createMember(
		username?: string,
		wallet_address?: string,
		principal_id?: string
	): Promise<Member> {
		try {
			const result = await db.execute(this.conn, insertMember, {
				username: username,
				wallet_address: wallet_address,
				principal_id: principal_id
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async updateMemberProfileS3keys(
		id?: number,
		profile_s3key?: string,
		profile_thumbnail_s3key?: string,
	): Promise<Member> {
		try {
			const result = await db.execute(this.conn, updateMemberProfileS3keys, {
				id: id,
				profile_s3key: profile_s3key,
				profile_thumbnail_s3key: profile_thumbnail_s3key
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	};

	async getMembersWithWalletAddressArray(
		walletAddressArray?: Array<string>,
	): Promise<Member[]> {
		try {
			const result = await db.execute(this.conn, selectMembersWithWalletAddressArray, {
				walletAddressArray: walletAddressArray
			});
			return result
		} catch (error) {
			throw error;
		}
	};

	async setOwnerFromMemberListTo(
		objList: {owner: string}[]
	) {
		try {
			const extractedOwners = objList.map((token: { owner: string; }) => token.owner);
			const memberList = await this.getMembersWithWalletAddressArray(extractedOwners);

			for (let obj of objList) {
				for (let member of memberList) {
					if (obj.owner === member.wallet_address) {
						(obj.owner as any) = member;
					}
				}
			}

			return objList
		} catch (error) {
			throw error;
		}
	}

	async setSenderFromMemberListTo(
		objList: {from: string}[]
	) {
		try {
			const extractedSenders = objList.map((obj: { from: string; }) => obj.from);
			console.log(extractedSenders)
			const memberList = await this.getMembersWithWalletAddressArray(extractedSenders);
			console.log(memberList)

			for (let obj of objList) {
				for (let member of memberList) {
					if (obj.from === member.wallet_address) {
						(obj.from as any) = member;
					}
				}
			}

			return objList
		} catch (error) {
			throw error;
		}
	}

	async updateMember(
		id?: number,
		username?: string,
		introduction?: string,
	) {
		try {
			const result = await db.execute(this.conn, updateMember, {
				id: id,
				username: username,
				introduction: introduction,
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async searchMembers(
		username?: string,
	): Promise<Member[]> {
		try {
			const result = await db.execute(this.conn, selectMembersLikeName, {
				username: username,
			});
			return result
		} catch (error) {
			throw error;
		}
	};

	async getProjectContributors(
		project_address?: string,
		start_num?: number,
		count_num?: number,
	): Promise<Member[]> {
		try {
			const result = await db.execute(this.conn, selectProjectContributors, {
				project_address,
				start_num,
				count_num,
			});
			return result
		} catch (error) {
			throw error;
		}
	}

	async getMemberFollower(
		id?: number,
		start_num?: number,
		count_num?: number,
	): Promise<Member[]> {
		try {
			const result = await db.execute(this.conn, selectFollower, {
				id,
				start_num,
				count_num,
			});
			return result
		} catch (error) {
			throw error;
		}
	}

	async getMemberFollowing(
		id?: number,
		start_num?: number,
		count_num?: number,
	): Promise<Member[]> {
		try {
			const result = await db.execute(this.conn, selectFollowing, {
				id,
				start_num,
				count_num,
			});
			return result
		} catch (error) {
			throw error;
		}
	}
}

export {
	Member,
}
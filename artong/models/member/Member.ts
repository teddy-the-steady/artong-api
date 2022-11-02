import * as db from '../../utils/db/db';
import Models from '../Models';
const selectMember = require('./selectMember.sql');
const selectMembers = require('./selectMembers.sql');
const insertMember = require('./insertMember.sql');
const updateMemberProfileS3keys = require('./updateMemberProfileS3keys.sql');
const selectMembersWithWalletAddressArray = require('./selectMembersWithWalletAddressArray.sql');

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
	walletAddressArray?: Array<string>;

	constructor(data: Partial<Member> = {}, conn: PoolClient) {
		super(conn);
		Object.assign(this, data);
	}

	async getMember(id?: number, wallet_address?: string): Promise<Member> {
		try {
			const result = await db.execute(this.conn, selectMember, {
				id: id,
				wallet_address: wallet_address?.toLowerCase()
			});
			return result[0]
		} catch (error) {
			throw error;
		}
	}

	async getMembers(
		username?: string,
		principal_id?: string
	): Promise<Member[]> {
		try {
			const result = await db.execute(this.conn, selectMembers, {
				username: username,
				principal_id: principal_id
			});
			return result
		} catch (error) {
			throw error;
		}
	};

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
}

export {
	Member,
}
import nodemailer from 'nodemailer'
import { getSmtpKeys } from '../common/ssmKeys'
import { InternalServerError } from '../error/errors';
import { AWSError } from '../error/errorCodes';

const smtp = async function () {
	const keys = await getSmtpKeys();
	if (!keys) throw new InternalServerError('SSM key error', AWSError);

	return nodemailer.createTransport({
		service: 'Naver',
		auth: {
			user: keys[`/email/${process.env.ENV}/user`],
			pass: keys[`/email/${process.env.ENV}/pass`],
		},
		tls: {
			rejectUnauthorized: false
		}
	});
}

export default smtp
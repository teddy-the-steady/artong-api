import nodemailer from 'nodemailer'
import { getSmtpKeys } from '../common/ssmKeys'

const smtp = async function () {
	const keys = await getSmtpKeys()

	return nodemailer.createTransport({
		service: "Naver",
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
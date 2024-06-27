import sgMail from '@sendgrid/mail';
import 'dotenv/config';

export async function sendEmailVerify(to: string, name: string, token: string): Promise<void> {
	try {
		const msg = {
			to,
			from: 'hi@pulong.co',
			templateId: 'd-3dcf9a750567402287197519975173e6',
			dynamicTemplateData: {
				name,
				url: `${process.env.APP_URL}/auth/signup/${token}`
			}
		};
		sgMail.setApiKey(process.env.SECRET_SENDGRID_API_KEY as string);
		sgMail.send(msg);
	} catch (error) {
		console.error(error);
	}
}

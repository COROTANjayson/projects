import sgMail from '@sendgrid/mail';
import { generateId } from 'lucia';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, message, setError } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { forgotSchema } from '$lib/schema/forgot';
import prisma from '$lib/server/prisma';
import 'dotenv/config';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, zod(forgotSchema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(forgotSchema));
		if (!form.valid) {
			return setError(form, 'Email not found');
		}

		const email = form.data.email;
		const user = await prisma.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			return setError(form, 'email', 'Email not found');
		}

		const forgotPasswordToken = generateId(40);
		const forgotPasswordTokenExpiry = new Date();
		forgotPasswordTokenExpiry.setHours(forgotPasswordTokenExpiry.getHours() + 3);
		await prisma.user.update({
			where: {
				email: email
			},
			data: {
				forgotPasswordToken,
				forgotPasswordTokenExpiry
			}
		});
		try {
			const msg = {
				to: email,
				from: 'hi@pulong.co', // Use the email address or domain you verified above
				templateId: 'd-dd60f4476a364ae7841f8e858a3a0f50',
				dynamicTemplateData: {
					name: user.name,
					url: `${process.env.APP_URL}/auth/forgot/${forgotPasswordToken}`
				}
			};
			sgMail.setApiKey(process.env.SECRET_SENDGRID_API_KEY as string);
			sgMail.send(msg);
		} catch (error) {
			console.error(error);
		}
		return message(form, 'Email sent with instructions to reset your password.');
	}
};

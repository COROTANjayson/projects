import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import type { PageServerLoad } from './$types';

import { changePasswordSchema } from '$lib/schema/changePassword';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, zod(changePasswordSchema));
	const token = event.params.slug;
	let error = false;
	if (token) {
		const tokenExist = await prisma.user.findFirst({
			where: {
				verifyEmailToken: token
			}
		});

		if (tokenExist) {
			await prisma.user.update({
				where: {
					id: tokenExist.id
				},
				data: {
					isEmailVerified: true,
					verifyEmailToken: null,
					verifyEmailTokenLastSent: null
				}
			});
			error = false;
		} else {
			error = true;
		}

		if (tokenExist) {
			error = false;
		} else {
			error = true;
		}
	} else {
		error = true;
	}
	if (error) {
		return {
			form,
			error: true,
			message: 'Invalid token or expired. Please request a new one.'
		};
	} else {
		return {
			form,
			error: false,
			message: 'Account is now verified'
		};
	}
};

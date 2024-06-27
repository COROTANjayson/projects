import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, message, setError } from 'sveltekit-superforms/server';

import type { PageServerLoad } from './$types';

import { changePasswordSchema } from '$lib/schema/changePassword';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, zod(changePasswordSchema));
	const token = event.params.slug;
	let error = false;
	let user = null;
	if (token) {
		const tokenExist = await prisma.user.findFirst({
			where: {
				forgotPasswordToken: token,
				forgotPasswordTokenExpiry: {
					gt: new Date()
				}
			}
		});
		if (tokenExist) {
			user = tokenExist;
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
			error: 'Invalid token or expired. Please request a new one.'
		};
	} else {
		return {
			form,
			user
		};
	}
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(changePasswordSchema));
		if (!form.valid) {
			return setError(
				form,
				'Password must be at least 8 characters long and confirm password must match.'
			);
		}
		const token = event.params.slug;
		if (token) {
			const user = await prisma.user.findFirst({
				where: {
					forgotPasswordToken: token,
					forgotPasswordTokenExpiry: {
						gt: new Date()
					}
				}
			});
			if (user) {
				const { password } = form.data;
				const hashedPassword = await new Argon2id().hash(password);
				try {
					await prisma.user.update({
						where: {
							id: user.id
						},
						data: {
							password: hashedPassword,
							forgotPasswordToken: null,
							forgotPasswordTokenExpiry: null
						}
					});
				} catch (e) {
					console.log(e);
					return setError(
						form,
						'An error occurred while updating your password. Please try again.'
					);
				}
				return message(form, 'Password updated successfully');
			} else {
				return setError(form, 'Invalid token or expired. Please request a new one.');
			}
		}
	}
};

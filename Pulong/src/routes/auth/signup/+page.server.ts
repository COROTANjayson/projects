import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, message, setError } from 'sveltekit-superforms/server';

import { sendEmailVerify } from '../../../lib/utils/sendEmailVerify';

import type { Actions, PageServerLoad } from './$types';

import { signupSchema } from '$lib/schema/signup';
import { lucia } from '$lib/server/auth';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	const form = await superValidate(event, zod(signupSchema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signupSchema));
		if (!form.valid) {
			return message(form, 'Invalid form');
		}

		const name = form.data.name;
		const email = form.data.email;
		const password = form.data.password;
		if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return setError(form, 'email', 'Invalid email address');
		}
		if (typeof name !== 'string' || name.length < 3 || name.length > 50) {
			return setError(form, 'name', 'Name should be 3-50 characters long');
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return setError(form, 'password', 'Password should be 6-255 characters long');
		}

		const hashedPassword = await new Argon2id().hash(password);
		const id = generateId(15);
		const verifyEmailToken = generateId(40);
		try {
			await prisma.user.create({
				data: {
					name,
					email,
					password: hashedPassword,
					id,
					verifyEmailToken,
					verifyEmailTokenLastSent: new Date()
				}
			});

			const session = await lucia.createSession(id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			sendEmailVerify(email, name, verifyEmailToken);
		} catch (e) {
			console.log(e);
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					return fail(400, {
						message:
							'There is a unique constraint violation, a new user cannot be created with this email'
					});
				}
			}
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		return redirect(302, '/dashboard');
	}
};

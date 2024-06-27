import { redirect } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, message, setError } from 'sveltekit-superforms/server';

import type { Actions, PageServerLoad } from './$types';

import { signinSchema } from '$lib/schema/signin';
import { lucia } from '$lib/server/auth';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	const form = await superValidate(event, zod(signinSchema));
	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(signinSchema));
		if (!form.valid) {
			return message(form, 'Invalid form');
		}

		const email = form.data.email;
		const password = form.data.password;

		if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return setError(form, 'email', 'Invalid email address');
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return setError(form, 'password', 'Password should be 6-255 characters long');
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			return setError(form, 'email', 'User not found');
		}

		const validPassword = await new Argon2id().verify(user.password, password);
		if (!validPassword) {
			return setError(form, 'password', 'Invalid password');
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		// return redirect(302, '/dashboard');
		return {
			success:true,
			form
		};
	}
};

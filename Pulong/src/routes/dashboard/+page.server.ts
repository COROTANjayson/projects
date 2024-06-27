import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';

import type { Actions, PageServerLoad } from './$types';

import { lucia } from '$lib/server/auth';
import prisma from '$lib/server/prisma';
import { sendEmailVerify } from '$lib/utils/sendEmailVerify';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/signin');
	}
	return {
		user: event.locals.user
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		return redirect(302, '/');
	},
	resendVerificationEmail: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}
		const verifyEmailToken = generateId(40);

		const user = await prisma.user.findUnique({
			where: {
				id: event.locals.user.id
			}
		});

		if (!user) {
			return fail(401);
		}
		if (user.verifyEmailTokenLastSent) {
			const currentTime = new Date();
			const lastSentTime = new Date(user.verifyEmailTokenLastSent);
			const timeDifference = currentTime.getTime() - lastSentTime.getTime();
			const minutesDifference = Math.floor(timeDifference / (1000 * 60));
			if (minutesDifference < 3) {
				return {
					success: false,
					message: 'Please wait for 3 minutes before requesting another verification email.'
				};
			}
		}

		await prisma.user.update({
			where: {
				id: event.locals.user.id
			},
			data: {
				verifyEmailToken,
				verifyEmailTokenLastSent: new Date()
			}
		});

		sendEmailVerify(user.email, user.name || '', verifyEmailToken);
		return {
			success: true,
			message: 'Verification email sent.'
		};
	}
};

import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import type { User } from '@prisma/client';
import { Lucia } from 'lucia';

import { dev } from '$app/environment';
import prisma from '$lib/server/prisma';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			name: attributes.name,
			isEmailVerified: attributes.isEmailVerified
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<User, 'id'>;
	}
}

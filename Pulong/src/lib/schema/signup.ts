import { z } from 'zod';

export const signupSchema = z
	.object({
		name: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8)
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmPassword'],
				fatal: true
			});
		}
	});

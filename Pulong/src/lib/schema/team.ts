import { z } from 'zod';
const agendaItemSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	minutes: z.number().default(30)
});

export const teamSchema = z
	.object({
		name: z.string().min(3),
		description: z.string().min(3),
		members: z.string().email().array(),
		start_date: z.string().min(1, { message: 'Start date should not be empty' }),
		start_time: z.string().default('08:00'),
		weekly_start_day: z.string().default('Monday'),
		agenda: z.array(agendaItemSchema).default([])
	})
	.superRefine((data, ctx) => {
		// if (data.members.length < 1) {
		// 	ctx.addIssue({
		// 		code: 'custom',
		// 		message: 'Please add at least one member to the team.',
		// 		path: ['members'],
		// 		fatal: true
		// 	});
		// }
		if (data.members.length > 2) {
			ctx.addIssue({
				code: 'custom',
				message: 'You can add a maximum of 8 members to a team.',
				path: ['members'],
				fatal: true
			});
		}
		const uniqueEmails = new Set(data.members.map((member) => member));
		if (uniqueEmails.size !== data.members.length) {
			ctx.addIssue({
				code: 'custom',
				message: 'Please make sure all members have unique email addresses.',
				path: ['members'],
				fatal: true
			});
		}

		const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
		for (const email of uniqueEmails) {
			if (!emailRegex.test(email)) {
				ctx.addIssue({
					code: 'custom',
					message: 'Please make sure all members have valid email addresses.',
					path: ['members'],
					fatal: true
				});
			}
		}

		return true;
	});

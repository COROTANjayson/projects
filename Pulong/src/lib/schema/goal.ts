import { z } from 'zod';

export const goalSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	ownerId: z.string(),
	teamId: z.string(),
	notes: z.string(),
	dueDate: z.string(),
	creatorId: z.string(),
	status: z.string().default('ongoing')
});

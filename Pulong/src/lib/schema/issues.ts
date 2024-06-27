import { z } from 'zod';

export const issueSchema = z.object({
	id: z.string().optional(),
	issueId: z.string().optional(),
	todoId: z.string().optional(),
	headlineId: z.string().optional(),
	goalId: z.string().optional(),
	name: z.string(),
	ownerId: z.string(),
	teamId: z.string(),
	kpiId: z.string(),
	notes: z.string(),
	dueDate: z.string(),
	creatorId: z.string(),
	status: z.string().default('ongoing')
	
});

import { z } from 'zod';

export const kpiSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	ownerId: z.string(),
	teamId: z.string(),
	creatorId: z.string(),
	unitOfMeasure: z.string().default('Number'),
	operator: z.string().default('≥'),
	goal: z.number().default(0),
	status: z.string()
});

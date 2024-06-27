import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { goalSchema } from '$lib/schema/goal';

export const load: PageServerLoad = async (event) => {
	// const form = await superValidate(event, zod(goalSchema));
	// let goals;

	// const { locals } = event;
	// form.data.ownerId = locals.user ? locals.user.id : '';
	// if (locals.user && locals.user.id) {
	// 	const teams = await getTeamsByUserID(locals.user.id);
	// 	const teamIds = teams.map((team) => team.id);
	// 	goals = await getGoalByTeamID(teamIds);
	// }
	return {
		// goalss
	};
};

import type { Actions } from './$types';
import { generateId } from 'lucia';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import { getGoalByTeamID } from '$lib/queries/goalQueires';

export const actions = {
	add: async (event) => {
		const form = await superValidate(event, zod(goalSchema));
		if (!form.valid) {
			return message(form, '');
		}
		const { name, teamId, notes, ownerId, dueDate, creatorId, status } = form.data;
		let goalId = generateId(30);
		const formatDueDate = new Date(dueDate);
		const goals = await prisma.goal.create({
			data: {
				id: goalId,
				name,
				teamId,
				notes,
				ownerId,
				creatorId,
				dueDate: formatDueDate,
				status
			}
		});
		return {
			success: true,
			add: true,
			form,
			goals
		};
	},
	edit: async (event) => {
		const form = await superValidate(event, zod(goalSchema));
		if (!form.valid) {
			return message(form, '');
		}
		const { name, teamId, notes, ownerId, id, dueDate, creatorId } = form.data;
		const formatDueDate = new Date(dueDate);
		const updategoal = await prisma.goal.update({
			where: {
				id: id
			},
			data: {
				name,
				teamId,
				notes,
				ownerId,
				creatorId,
				dueDate: formatDueDate
			}
		});
		return {
			success: true,
			updategoal,
			form,
			update: true
		};
	},
	delete: async ({ url }) => {
		try {
			const id = url.searchParams.get('id');
			if (id) {
				await prisma.goal.delete({
					where: {
						id: id
					}
				});
			}

			return { success: true, goal: true };
		} catch (error) {
			return { success: false };
		}
	}
} satisfies Actions;

import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { headlineSchema } from '$lib/schema/headline';

export const load: PageServerLoad = async (event) => {
	// let kpi;
	// const { locals } = event;
	// if (locals.user && locals.user.id) {
	// 	const teams = await getTeamsByUserID(locals.user.id);
	// 	const teamIds = teams.map((team) => team.id);
	// 	kpi = await getKSIByTeamID(teamIds);
	// }
	return {
		// kpi
	};
};

import type { Actions } from './$types';
import { generateId } from 'lucia';
import { getHeadlineByTeamID } from '$lib/queries/headlineQueires';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import { kpiSchema } from '$lib/schema/kpi';
import { getKSIByTeamID } from '$lib/queries/kpiQueires';
// import { getTeamsByUserID } from '$lib/queries/teamsQueries';
// import { getheadlineByTeamID } from '$lib/queries/headlineQueires';

export const actions = {
	add: async (event) => {
		const form = await superValidate(event, zod(kpiSchema));
		if (!form.valid) {
			return message(form, '');
		}
		const { name, teamId, ownerId, creatorId, status, unitOfMeasure, operator, goal } = form.data;
		let kpiId = generateId(30);
		const kpi = await prisma.kpi.create({
			data: {
				id: kpiId,
				name,
				teamId,
				ownerId,
				creatorId,
				status,
				unitOfMeasure,
				operator,
				goal
			}
		});
		return {
			success: true,
			add: true,
			form
		};
	},
	edit: async (event) => {
		const form = await superValidate(event, zod(kpiSchema));
		if (!form.valid) {
			return message(form, '');
		}
		const { name, teamId, ownerId, id, creatorId, unitOfMeasure, operator, goal } = form.data;
		const kpi = await prisma.kpi.update({
			where: {
				id: id
			},
			data: {
				name,
				teamId,
				ownerId,
				creatorId,
				unitOfMeasure,
				operator,
				goal
			}
		});
		return { success: true, form, update: true };
	},
	delete: async ({ url }) => {
		try {
			const id = url.searchParams.get('id');
			if (id) {
				await prisma.kpi.delete({
					where: {
						id: id
					}
				});
			}
			return { success: true, kpi: true };
		} catch (error) {
			console.log(error);
			return { success: false };
		}
	}
} satisfies Actions;

import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { headlineSchema } from '$lib/schema/headline';

export const load: PageServerLoad = async (event) => {
	// let headlines;
	// const { locals } = event;
	// if (locals.user && locals.user.id) {
	// 	const teams = await getTeamsByUserID(locals.user.id);
	// 	const teamIds = teams.map((team) => team.id);
	// 	headlines = await getHeadlineByTeamID(teamIds, false);
	// }
	return {
		// headlines
	};
};

import type { Actions } from './$types';
import { generateId } from 'lucia';
import { getHeadlineByTeamID } from '$lib/queries/headlineQueires';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
// import { getTeamsByUserID } from '$lib/queries/teamsQueries';
// import { getheadlineByTeamID } from '$lib/queries/headlineQueires';

export const actions = {
	add: async (event) => {
		const form = await superValidate(event, zod(headlineSchema));
		if (!form.valid) {
			return message(form, '');
		}
		const { name, teamId, notes, ownerId, creatorId, status } = form.data;
		let headlineId = generateId(30);
		const addheadline = await prisma.headline.create({
			data: {
				id: headlineId,
				name,
				teamId,
				notes,
				ownerId,
				creatorId,
				status
			}
		});
		return {
			success: true,
			add: true,
			addheadline,
			form
		};
	},
	edit: async (event) => {
		const form = await superValidate(event, zod(headlineSchema));
		if (!form.valid) {
			return message(form, '');
		}
		const { name, teamId, notes, ownerId, id, creatorId } = form.data;
		const updateheadline = await prisma.headline.update({
			where: {
				id: id
			},
			data: {
				name,
				teamId,
				notes,
				ownerId,
				creatorId
			}
		});
		return {
			success: true,
			form,
			update: true
		};
	},
	delete: async ({ url }) => {
		try {
			const id = url.searchParams.get('id');
			if (id) {
				await prisma.headline.delete({
					where: {
						id: id
					}
				});
			}
			return { success: true, headline: true };
		} catch (error) {
			console.log(error);
			return { success: false };
		}
	}
} satisfies Actions;

import { fail } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { Actions, PageServerLoad } from './$types';

import { teamSchema } from '$lib/schema/team';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(teamSchema));
	form.data.agenda = [
		{ name: 'Segue', minutes: 5 },
		{ name: 'KPI', minutes: 5 },
		{ name: 'Goals', minutes: 5 },
		{ name: 'Headlines', minutes: 5 },
		{ name: 'To-Do', minutes: 5 },
		{ name: 'IDS', minutes: 60 },
		{ name: 'Conclude', minutes: 5 }
	];
	return {
		form
	};
};

export const actions: Actions = {
	addTeam: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}

		const form = await superValidate(event, zod(teamSchema));
		if (!form.valid) {
			return message(form, '');
		}

		const userEmail = event.locals.user.email;
		const teamId = generateId(30);
		const teamMembers = [];
		for (const email of form.data.members) {
			if (email === userEmail) {
				return message(
					form,
					'Please note that you cannot add your own email to the team. Kindly remove it from the list.',
					{
						status: 403
					}
				);
			}

			const user = await prisma.user.findUnique({
				where: {
					email
				}
			});
			if (!user) {
				return message(
					form,
					`The email address ${email} is not associated with any account. Please make sure all members email is registered.`,
					{
						status: 404
					}
				);
			}
			teamMembers.push({
				teamId,
				userId: user.id
			});
		}
		const agenda = form.data.agenda.map((val: any) => {
			val.teamId = teamId;
			delete val.id
			return val;
		});
		const name = form.data.name;
		const description = form.data.description;
		const start_date = new Date(form.data.start_date);
		const start_time = form.data.start_time;
		const weekly_start_day = form.data.weekly_start_day;
		const team = await prisma.team.create({
			data: {
				id: teamId,
				name,
				ownerId: event.locals.user.id,
				description,
				start_time,
				start_date,
				weekly_start_day
			}
		});
		await prisma.teamAgenda.createMany({
			data: agenda
		});

		await prisma.teamMember.createMany({
			data: teamMembers
		});

		return {
			success: true,
			team,
			form
		};
	}
};

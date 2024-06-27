import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { PageServerLoad, Actions } from './$types';

import { teamSchema } from '$lib/schema/team';
import prisma from '$lib/server/prisma';
import { formatInputDate } from '$lib/utils/formatDate';

export const load: PageServerLoad = async (event) => {
	const team = await prisma.team.findUnique({
		where: {
			id: event.params.id as string
		},
		select: {
			id: true,
			name: true,
			description: true,
			start_date: true,
			weekly_start_day: true,
			start_time: true,
			members: {
				select: {
					userId: true,
					isAccepted: true,
					user: {
						select: {
							name: true,
							email: true
						}
					}
				}
			},
			agenda: {
				select: {
					id: true,
					name: true,
					minutes: true
				}
			},
			owner: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});
	if (!team) {
		return fail(404);
	}
	if (team.owner.id !== event?.locals?.user?.id) {
		return fail(403);
	}
	const members = team?.members.map((member) => {
		return {
			userId: member.userId,
			name: member.user.name,
			email: member.user.email,
			isAccepted: member.isAccepted
		};
	});
	let start_date = formatInputDate(team.start_date);
	team.members = [];


	const teamData = {
		id: team.id,
		name: team.name,
		description: team.description || '',
		start_date: start_date,
		start_time: team.start_time,
		weekly_start_day: team.weekly_start_day,
		members: [],
		agenda: team.agenda
	};
	const form = await superValidate(teamData, zod(teamSchema));
	return {
		form,
		members
	};
};

export const actions: Actions = {
	removeMember: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}

		const data = await event.request.formData();
		const selectedRemoveMember = data.get('selectedRemoveMember');
		const isRemoveMember = data.get('removeMember');

		if (isRemoveMember) {
			await prisma.teamMember.deleteMany({
				where: {
					teamId: event.params.id as string,
					user: {
						email: selectedRemoveMember as string
					}
				}
			});
		}
	},
	editTeam: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}

		const form = await superValidate(event, zod(teamSchema));
		if (!form.valid) {
			return message(form, '');
		}
		let start_date = new Date(form.data.start_date);
		await prisma.team.update({
			where: {
				id: event.params.id as string
			},
			data: {
				name: form.data.name,
				description: form.data.description,
				start_time: form.data.start_time,
				weekly_start_day: form.data.weekly_start_day,
				start_date: start_date
			}
		});

		for (const item of form.data.agenda) {
			await prisma.teamAgenda.update({
				where: {
					id: item.id
				},
				data: {
					name: item.name,
					minutes: item.minutes
				}
			});
		}
		const userEmail = event.locals.user.email;
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

			const found = await prisma.teamMember.findFirst({
				where: {
					teamId: event.params.id as string,
					userId: user.id
				}
			});

			if (found) {
				return message(
					form,
					`The email address ${email} is already a member of the team. Please remove it from the list.`,
					{
						status: 409
					}
				);
			}

			teamMembers.push({
				teamId: event.params.id as string,
				userId: user.id
			});
		}

		await prisma.teamMember.createMany({
			data: teamMembers
		});

		return {
			form
		};
	}
};

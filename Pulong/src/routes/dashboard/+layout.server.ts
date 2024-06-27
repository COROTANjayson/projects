import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goalSchema } from '$lib/schema/goal';
import type { PageServerLoad, PageServerLoadEvent } from './$types';
import prisma from '$lib/server/prisma';
import { headlineSchema } from '$lib/schema/headline';
import { getCurrentDate } from '$lib/utils/formatDate';
import { issueSchema } from '$lib/schema/issues';
import { todoSchema } from '$lib/schema/todo';
import { kpiSchema } from '$lib/schema/kpi';
import { getTeamMembers } from '$lib/queries/teamMembers';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/signin');
	}
	const goalForm = await superValidate(zod(goalSchema));
	const headlineForm = await superValidate(zod(headlineSchema));
	const issueForm = await superValidate(zod(issueSchema));
	const todoForm = await superValidate(zod(todoSchema));
	const kpiForm = await superValidate(zod(kpiSchema));

	let users = await prisma.user.findMany({
		select: {
			id: true,
			name: true
		}
	});
	const teams = await prisma.team.findMany({
	
		where: {
			OR: [
				{
					owner: {
						id: event.locals.user.id
					}
				},
				{
					members: {
						some: {
							userId: event.locals.user.id
						}
					}
				}
			]
		},
		select: {
			id: true,
			name: true,
			start_date: true,
			weekly_start_day: true,
			start_time: true,
			owner: {
				select: {
					id: true,
					name: true
				}
			},
			members: {
				select: {
					userId: true,
					user: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});
	goalForm.data.ownerId = event.locals.user ? event.locals.user.id : '';
	goalForm.data.creatorId = event.locals.user ? event.locals.user.id : '';

	goalForm.data.dueDate = getCurrentDate();

	headlineForm.data.ownerId = event.locals.user ? event.locals.user.id : '';
	headlineForm.data.creatorId = event.locals.user ? event.locals.user.id : '';

	issueForm.data.ownerId = event.locals.user ? event.locals.user.id : '';
	issueForm.data.creatorId = event.locals.user ? event.locals.user.id : '';

	issueForm.data.dueDate = getCurrentDate();

	todoForm.data.ownerId = event.locals.user ? event.locals.user.id : '';
	todoForm.data.creatorId = event.locals.user ? event.locals.user.id : '';
	todoForm.data.dueDate = getCurrentDate();
	kpiForm.data.ownerId = event.locals.user ? event.locals.user.id : '';
	kpiForm.data.creatorId = event.locals.user ? event.locals.user.id : '';
	kpiForm.data.unitOfMeasure = 'Number';
	kpiForm.data.operator = '≥';
	kpiForm.data.goal = 0;
	// let members:any[] = []

	if (teams && teams.length) {
		let team: any = teams && teams.length > 0 ? teams[0] : {};
		goalForm.data.teamId = team.id;
		headlineForm.data.teamId = team.id;
		issueForm.data.teamId = team.id;
		todoForm.data.teamId = team.id;
		kpiForm.data.teamId = team.id;
		// members = await getTeamMembers( team.id)
	}

	return {
		kpiForm,
		todoForm,
		issueForm,
		goalForm,
		headlineForm,
		users,
		teams,
		user: event.locals.user
	};
};

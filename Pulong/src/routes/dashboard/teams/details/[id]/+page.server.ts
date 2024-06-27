import type { PageServerLoad } from './$types';

import prisma from '$lib/server/prisma';
import { getAllTeamAttendanceByUserId, getTeamMeetingByTeamIds } from '$lib/queries/meetingQueries';
import { superValidate } from 'sveltekit-superforms';
import { headlineSchema } from '$lib/schema/headline';
import { getCurrentDate } from '$lib/utils/formatDate';
import { issueSchema } from '$lib/schema/issues';
import { todoSchema } from '$lib/schema/todo';
import { kpiSchema } from '$lib/schema/kpi';
import { goalSchema } from '$lib/schema/goal';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	let teamId = event.params.id
	const team = await prisma.team.findUnique({
		where: {
			id: event.params.id as string
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
			},
			agenda: {
				select: {
					id: true,
					name: true
				}
			},
			teamMeeting: {
				select: {
					id: true,
					isStarted: true,
					isCurrent: true
				}
			}
		}
	});
	const goalForm = await superValidate(zod(goalSchema));
	const headlineForm = await superValidate(zod(headlineSchema));
	const issueForm = await superValidate(zod(issueSchema));
	const todoForm = await superValidate(zod(todoSchema));
	const kpiForm = await superValidate(zod(kpiSchema));
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

	if (teamId) {
		goalForm.data.teamId = teamId;
		headlineForm.data.teamId = teamId;
		issueForm.data.teamId = teamId;
		todoForm.data.teamId = teamId;
		kpiForm.data.teamId = teamId;
	}
	return {
		kpiForm,
		todoForm,
		issueForm,
		goalForm,
		headlineForm,
		team
	};
};

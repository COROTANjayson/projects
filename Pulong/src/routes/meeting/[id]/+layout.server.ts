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
import {
	getTeamMeetingById,
	getTeamAttendanceByUserId,
	getCurrentMeeting
} from '$lib/queries/meetingQueries';
import { getTeamsById } from '$lib/queries/teamsQueries';
import { getTeamMembersRating } from '$lib/queries/teamMembers';

export const load: PageServerLoad = async (event: PageServerLoadEvent) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/signin');
	}
	const goalForm = await superValidate(zod(goalSchema));
	const headlineForm = await superValidate(zod(headlineSchema));
	const issueForm = await superValidate(zod(issueSchema));
	const todoForm = await superValidate(zod(todoSchema));
	const kpiForm = await superValidate(zod(kpiSchema));

	let teamId = event.params.id;
	let teamMeeting = await getCurrentMeeting(teamId);
	// let teamMeeting = await getTeamMeetingById(meetingId);
	let users = await prisma.user.findMany({
		select: {
			id: true,
			name: true
		}
	});
	let teams: any;
	let teamMembers: { id: string; userId: string; name: string | null; rating: null | number }[] =
		[];

	if (teamMeeting && teamMeeting.teamId) {
		teams = await getTeamsById(teamMeeting.teamId);
		let teamId = event.params.id;
		if (teamId) {
			teamMembers = await getTeamMembersRating(teamId, teamMeeting.id);
		}
	}
	let userAttendanceInfo: any;
	if (teamMeeting) {
		userAttendanceInfo = await getTeamAttendanceByUserId(event.locals.user.id, teamMeeting.id);
	}

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

	if (teams && teams.length) {
		let team: any = teams && teams.length > 0 ? teams[0] : {};
		goalForm.data.teamId = team.id;
		headlineForm.data.teamId = team.id;
		issueForm.data.teamId = team.id;
		todoForm.data.teamId = team.id;
		kpiForm.data.teamId = team.id;
	}

	return {
		kpiForm,
		todoForm,
		issueForm,
		goalForm,
		headlineForm,
		users,
		teamMeeting,
		teams,
		teamMembers,
		user: event.locals.user,
		userAttendanceInfo: userAttendanceInfo
	};
};

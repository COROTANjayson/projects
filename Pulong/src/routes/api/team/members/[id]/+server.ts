import { getIssuesByTeamID } from '$lib/queries/issuesQueires';
import { upsertKpiScore } from '$lib/queries/kpiQueires';
import {
	createMeeting,
	getTeamAttendanceByUserId,
	checkTeamMember,
	getTeamMeetingTeamId,
	checkAttendanceRole,
	getAttendanceInfo,
	getCurrentMeeting
} from '$lib/queries/meetingQueries';
import { getTeamMembers, getTeamMembersRating } from '$lib/queries/teamMembers';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request, params }) => {
	try {
		const teamId = params.id;
		if (locals.user && locals.user.id) {
			if (!teamId) {
				return new Response(
					JSON.stringify({ success: false, message: 'Please check you parameter' })
				);
			}
			let teamMembers = await getTeamMembers(teamId);

			return new Response(JSON.stringify({ success: true, data: teamMembers }));
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

import { getIssuesByTeamID } from '$lib/queries/issuesQueires';
import { upsertKpiScore } from '$lib/queries/kpiQueires';
import {
	createMeeting,
	getTeamAttendanceByUserId,
	checkTeamMember,
	getTeamMeetingTeamId,
	checkAttendanceRole,
	getAttendanceInfo
} from '$lib/queries/meetingQueries';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request, params }) => {
	try {
		const agendaId = params.slug;
		if (locals.user && locals.user.id) {
			const body = await request.json();
			const { active } = body;
			if (active !== undefined && agendaId) {
				let update = await prisma.teamAgenda.update({
					where: {
						id: agendaId
					},
					data: {
						active
					}
				});
				return new Response(JSON.stringify({ success: true, data: update }));
			} else {
				return new Response(
					JSON.stringify({ success: false, message: 'Please check you request' })
				);
			}
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

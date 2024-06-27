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
		let issues: any = [];
		const meetingId = params.slug;
		if (locals.user && locals.user.id) {
			const body = await request.json();
			const { role, teamId } = body;
			const isMember = await checkTeamMember(locals.user.id, teamId);
			if (!isMember) {
				return new Response(
					JSON.stringify({ success: false, message: 'You are not a member of this team' })
				);
			}
			
			let userAttendance = await getAttendanceInfo(locals.user.id, meetingId)
			if(userAttendance && userAttendance.isJoined && userAttendance.role === role) {
				return new Response(
					JSON.stringify({ success: true, message: 'Already Joined' })
				);
			}
			let isScribeExist = await checkAttendanceRole('scribe', meetingId);
			let currentRole = role === 'scribe' && !isScribeExist ? role : 'follower';
			const currentDate = new Date();
			const update = await prisma.teamMeetingAttendance.upsert({
				where: {
					id: locals.user.id + meetingId
				},
				update: {
					role: currentRole,
					joinedAt: currentDate,
					isJoined: true
				},
				create: {
					id: locals.user.id + meetingId,
					userId: locals.user.id,
					role: currentRole,
					meetingId: meetingId,
					isJoined: true,
					isPresent:true
				}
			});
			return new Response(JSON.stringify({ success: true, update }));
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

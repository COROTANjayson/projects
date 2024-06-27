import { getIssuesByTeamID } from '$lib/queries/issuesQueires';
import { upsertKpiScore } from '$lib/queries/kpiQueires';
import {
	createMeeting,
	getTeamAttendanceByUserId,
	checkTeamMember,
	getTeamMeetingTeamId,
	checkAttendanceRole,
	getTeamMeetingById,
	getAttendanceByMeetingId
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
			const { role } = body;
			// const isMember = await checkTeamMember(locals.user.id, teamId);
			// if (!isMember) {
			// 	return new Response(
			// 		JSON.stringify({ success: false, message: 'You are not a member of this team' })
			// 	);
			// }
			let attendances = await getAttendanceByMeetingId(meetingId);
			await prisma.teamMeetingAttendance.updateMany({
				where: {
					meetingId: meetingId
				},
				data: {
					isJoined: false
				}
			});

			if (role === 'scribe' && params) {
				let meeating = await prisma.teamMeeting.update({
					where: {
						id: meetingId
					},
					data: {
						isStarted: false,
						isCurrent: false
					}
				});

				return new Response(JSON.stringify({ success: true, message: 'Meeting ended' }));
			} else if (role === 'follower' && attendances.length <= 1) {
				await prisma.teamMeeting.delete({
					where: {
						id: meetingId
					}
				});
				return new Response(
					JSON.stringify({
						success: false,
						message: 'Remove created meeting'
					})
				);
			} else {
				return new Response(
					JSON.stringify({
						success: false,
						message: 'Leaved a meeting'
					})
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

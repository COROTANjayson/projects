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
import { getTeamMembersRating } from '$lib/queries/teamMembers';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request, params }) => {
	try {
		const userId = params.slug;
		if (locals.user && locals.user.id) {
			const body = await request.json();
			const url = new URL(request.url);
			const { teamId, meetingId, rating } = body;
			if (!teamId || !meetingId || !rating) {
				return new Response(
					JSON.stringify({ success: false, message: 'Please check you parameter' })
				);
			}
			const isMember = await checkTeamMember(locals.user.id, teamId);
			if (!isMember) {
				return new Response(
					JSON.stringify({ success: false, message: 'You are not a member of this team' })
				);
			}
			let rate: number = rating ? rating : 0;
			let userAttendance = await getAttendanceInfo(userId, meetingId);
			if (userAttendance) {
				const update = await prisma.teamMeetingAttendance.update({
					where: {
						id: userAttendance.id
					},
					data: {
						meetRating: rate
					}
				});
				return new Response(JSON.stringify({ success: true, message: 'Updated rating', data:update }));
			} else {
				const create = await prisma.teamMeetingAttendance.create({
					data: {
						id: userId + meetingId,
						userId: userId,
						role: 'follower',
						meetingId: meetingId,
						isJoined: false,
						isPresent: false,
						meetRating: rate
					}
				});
				return new Response(JSON.stringify({ success: true, message: 'Created attendance', data:create }));
			}
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

export const GET: RequestHandler = async ({ locals, request, params }) => {
	try {
		const teamId = params.slug;
		if (locals.user && locals.user.id) {
			if (!teamId) {
				return new Response(
					JSON.stringify({ success: false, message: 'Please check you parameter' })
				);
			}
			let teamMeeting = await getCurrentMeeting(teamId);
			// let teamMeeting = await getTeamMeetingById(meetingId);

			let teamMembers: { id: string; userId: string; name: string | null; rating: null|number }[] = [];

			if (teamMeeting && teamMeeting.teamId) {
				if (teamId) {
					teamMembers = await getTeamMembersRating(teamId, teamMeeting.id);
				}
			}
			return new Response(JSON.stringify({ success: true, data: teamMembers }));
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

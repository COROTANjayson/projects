import { getCurrentMeeting } from '$lib/queries/meetingQueries';
import { getTeamMembersRating } from '$lib/queries/teamMembers';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request, params }) => {
	try {
		const todoId = params.slug;
		if (locals.user && locals.user.id) {
			const body = await request.json();
			const url = new URL(request.url);
			const { isComplete } = body;
			if (isComplete === undefined) {
				return new Response(
					JSON.stringify({ success: false, message: 'Please check you parameter' })
				);
			}

			const update = await prisma.todo.update({
				where: {
					id: todoId
				},
				data: {
					isComplete: isComplete
				}
			});
			return new Response(
				JSON.stringify({ success: true, message: 'Updated Todo Status', data: update })
			);
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
			let teamMembers: {
				id: string;
				userId: string;
				name: string | null;
				rating: null | number;
			}[] = [];

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

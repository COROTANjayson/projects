import { getCurrentMeeting, getTeamMeetingTeamId } from '$lib/queries/meetingQueries';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		let issues: any = [];
		if (locals.user && locals.user.id) {
		}

		return new Response(JSON.stringify({ success: true, issues }));
	} catch (e) {
		return new Response(JSON.stringify({ success: false }));
	}
};

export const POST: RequestHandler = async ({ locals, request, url }) => {
	try {
		let issues: any = [];
		if (locals.user && locals.user.id) {
			const body = await request.json();
			const { teamId, role } = body;
			if (!teamId) {
				return new Response(
					JSON.stringify({ success: false, message: 'Please pass a teamId parameter' })
				);
			}
			// let currentMeeting = await getTeamMeetingTeamId(teamId);
			let currentMeeting = await getCurrentMeeting(teamId);

			let meeting;
			if (!currentMeeting) {
				meeting = await prisma.teamMeeting.create({
					data: {
						code: 'hfsjsd',
						startedById: locals.user.id,
						isStarted: role === 'scribe' ? true : false,
						isCurrent: true,
						teamId: teamId
					}
				});
				return new Response(JSON.stringify({ success: true, meeting }));
			} else if (role === 'scribe') {
				meeting = await prisma.teamMeeting.update({
					where: {
						id: currentMeeting.id
					},
					data: {
						isStarted: true,
						startAt: new Date()
					}
				});
				return new Response(JSON.stringify({ success: true, meeting }));
			} else {
				return new Response(JSON.stringify({ success: true, meeting: currentMeeting }));
			}
			// else if (currentMeeting && !currentMeeting.isStarted && role === 'scribe') {
			// 	meeting = await prisma.teamMeeting.update({
			// 		where: {
			// 			id: currentMeeting.id
			// 		},
			// 		data: {
			// 			startAt: new Date(),
			// 			startedById: locals.user.id,
			// 			isStarted: true
			// 		}
			// 	});
			// 	return new Response(JSON.stringify({ success: true, meeting }));
			// }
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

// export const GET: RequestHandler = async ({ locals }) => {
// 	try {
// 		let issues: any = [];
// 		if (locals.user && locals.user.id) {
// 		}

// 		return new Response(JSON.stringify({ success: true, issues }));
// 	} catch (e) {
// 		return new Response(JSON.stringify({ success: false }));
// 	}
// };

// export const POST: RequestHandler = async ({ locals, request, url }) => {
// 	try {
// 		let issues: any = [];
// 		if (locals.user && locals.user.id) {
// 			const body = await request.json();
// 			const { teamId, role } = body;
// 			if (!teamId) {
// 				return new Response(
// 					JSON.stringify({ success: false, message: 'Please pass a teamId parameter' })
// 				);
// 			}
// 			let currentMeeting = await getTeamMeetingTeamId(teamId);
// 			let meeting;
// 			if (!currentMeeting) {
// 				meeting = await prisma.teamMeeting.create({
// 					data: {
// 						code: 'hfsjsd',
// 						startedById: locals.user.id,
// 						isStarted: role === 'scribe' ? true : false,
// 						teamId: teamId
// 					}
// 				});
// 				return new Response(JSON.stringify({ success: true, meeting }));
// 			} else if (currentMeeting && !currentMeeting.isStarted && role === 'scribe') {
// 				meeting = await prisma.teamMeeting.update({
// 					where: {
// 						id: currentMeeting.id
// 					},
// 					data: {
// 						startAt: new Date(),
// 						startedById: locals.user.id,
// 						isStarted: true
// 					}
// 				});
// 				return new Response(JSON.stringify({ success: true, meeting }));
// 			} else {
// 				return new Response(JSON.stringify({ success: true, meeting: currentMeeting }));
// 			}
// 		} else {
// 			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		return new Response(JSON.stringify({ success: false }));
// 	}
// };

// import type { PageServerLoad } from '../$types';

// import prisma from '$lib/server/prisma';
// import { getAllTeamAttendanceByUserId, getTeamMeetingByTeamIds } from '$lib/queries/meetingQueries';

// export const load: PageServerLoad = async (event: { locals: { user: { id: any } } }) => {
// 	const teams = await prisma.team.findMany({
// 		where: {
// 			OR: [
// 				{
// 					owner: {
// 						id: event.locals.user.id
// 					}
// 				},
// 				{
// 					members: {
// 						some: {
// 							userId: event.locals.user.id
// 						}
// 					}
// 				}
// 			]
// 		},
// 		select: {
// 			id: true,
// 			name: true,
// 			start_date: true,
// 			weekly_start_day: true,
// 			start_time: true,
// 			owner: {
// 				select: {
// 					id: true,
// 					name: true
// 				}
// 			},
// 			members: {
// 				select: {
// 					userId: true,
// 					user: {
// 						select: {
// 							name: true
// 						}
// 					}
// 				}
// 			},
// 			agenda: {
// 				select: {
// 					id: true,
// 					name: true
// 				}
// 			},
// 			teamMeeting: {
// 				select: {
// 					id: true,
// 					isStarted: true,
// 					isCurrent:true
// 				}
// 			}
// 		}
// 	});

// 	let teamsIds = teams.map((team) => team.id);
// 	let teamMeeting =await  getTeamMeetingByTeamIds(teamsIds);
// 	let userAttendances = await getAllTeamAttendanceByUserId(event.locals.user.id)
// 	return {
// 		teams,
// 		teamMeeting,
// 		userAttendances
// 	};
// };

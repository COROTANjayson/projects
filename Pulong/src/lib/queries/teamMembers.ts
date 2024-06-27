import prisma from '$lib/server/prisma';
import _ from 'lodash';
export const getTeamMembersRating = async (teamId: string, meetingId: string) => {
	let team = await prisma.team.findFirst({
		where: {
			id: teamId
		},
		select: {
			id: true,
			ownerId: true,
			owner: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});
	let teamMemberQuery = await prisma.teamMember.findMany({
		where: {
			teamId: teamId
		},
		select: {
			id: true,
			userId: true,
			user: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});
	let attendance = await prisma.teamMeetingAttendance.findMany({
		where: {
			meetingId: meetingId
		},
		select: {
			id: true,
			userId: true,
			meetRating: true
		}
	});
	let teamMembers = teamMemberQuery.map((val) => {
		return {
			id: val.id,
			userId: val.userId,
			name: val.user.name,
			rating: null as number | null
		};
	});

	if (team) {
		teamMembers = [
			{
				id: team.ownerId,
				userId: team.ownerId,
				name: team.owner.name,
				rating: null as number | null
			},
			...teamMembers
		];
	}

	teamMembers = teamMembers.map((val) => {
		let user = _.find(attendance, { userId: val.userId });
		if (user) {
			val.rating = user.meetRating;
		}
		// if(val.userId)
		return val;
	});

	return teamMembers;
};

export const getTeamMembers = async (teamId: string) => {
	let team = await prisma.team.findFirst({
		where: {
			id: teamId
		},
		select: {
			id: true,
			ownerId: true,
			owner: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});
	let teamMemberQuery = await prisma.teamMember.findMany({
		where: {
			teamId: teamId
		},
		select: {
			id: true,
			userId: true,
			user: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});
	let teamMembers = teamMemberQuery.map((val) => {
		return {
			id: val.userId,
			name: val.user.name
		};
	});

	if (team) {
		teamMembers = [
			{
				id: team.ownerId,
				name: team.owner.name
			},
			...teamMembers
		];
	}

	return teamMembers;
};

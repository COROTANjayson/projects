import prisma from '$lib/server/prisma';

export const getGoalByTeamID = async (teamIds: Array<string>) => {
	let rocks = await prisma.goal.findMany({
		orderBy: {
			createdAt: 'asc'
		},
		where: {
			teamId: {
				in: teamIds
			}
		},
		select: {
			id: true,
			name: true,
			teamId: true,
			team: {
				select: {
					id: true,
					name: true
				}
			},
			notes: true,
			ownerId: true,
			creatorId: true,
			createdAt: true,
			updatedAt: true,
			dueDate: true,
			status: true,
			owner: {
				select: {
					id: true,
					name: true
				}
			},
			creator: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});
	return rocks;
};

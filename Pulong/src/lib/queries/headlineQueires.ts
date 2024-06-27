import prisma from '$lib/server/prisma';

export const getHeadlineByTeamID = async (
	teamIds: Array<string>,
	isComplete: boolean | undefined = undefined
) => {
	let condition: any = {
		AND: [
			{
				teamId: {
					in: teamIds
				}
			}
		]
	};
	if (isComplete !== undefined) {
		condition.AND.push({ isComplete: isComplete });
	}

	let rocks = await prisma.headline.findMany({
		where: condition,
		orderBy: {
			createdAt: 'asc'
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
			status: true,
			isComplete: true,
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

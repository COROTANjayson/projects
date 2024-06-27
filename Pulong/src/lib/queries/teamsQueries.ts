import prisma from '$lib/server/prisma';

export const getTeamsByUserID = async (id: string) => {
	const teams = await prisma.team.findMany({
		where: {
			OR: [
				{
					owner: {
						id: id
					}
				},
				{
					members: {
						some: {
							userId: id
						}
					}
				}
			]
		},
		select: {
			id: true,
			name: true,
			owner: {
				select: {
					id: true,
					name: true
				}
			},
			members: {
				select: {
					userId: true,
					user: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});
	return teams;
};

export const getTeamsById = async (id: string) => {
	const team = await prisma.team.findMany({
		where: {
			id: id
		},
		select: {
			id: true,
			name: true,
			start_date: true,
			weekly_start_day: true,
			start_time: true,
			owner: {
				select: {
					id: true,
					name: true
				}
			},
			members: {
				select: {
					userId: true,
					user: {
						select: {
							name: true
						}
					}
				}
			}
		}
	});
	return team;
};

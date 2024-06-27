import prisma from '$lib/server/prisma';

export const getKSIByTeamID = async (teamIds: Array<string>) => {
	let rocks = await prisma.kpi.findMany({
		where: {
			teamId: {
				in: teamIds
			}
		},
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
					name: true,
					start_date: true,
					start_time: true,
					weekly_start_day: true
				}
			},
			ownerId: true,
			creatorId: true,
			createdAt: true,
			updatedAt: true,
			status: true,
			unitOfMeasure: true,
			operator: true,
			goal: true,
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
			},
			scores: {
				select: {
					id: true,
					date: true,
					value: true,
					kpiId: true
				}
			}
		}
	});
	return rocks;
};
interface Score {
	id: string;
	date: string;
	value: number;
	kpiId: string;
}
export const upsertKpiScore = async (score: Score) => {
	try {
		const { id, date, value, kpiId } = score;
		if (value) {
			const record = await prisma.kpiScores.upsert({
				where: {
					id: id
				},
				update: {
					value: value
				},
				create: {
					id: id,
					date: date,
					kpiId: kpiId,
					value: value
				}
			});
		} else {
			await prisma.kpiScores.delete({
				where: {
					id: id
				}
			});
		}
	} catch (error) {
		console.error('Error upserting record:', error);
	} finally {
		await prisma.$disconnect();
	}
};

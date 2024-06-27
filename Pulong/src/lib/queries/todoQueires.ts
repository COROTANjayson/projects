import prisma from '$lib/server/prisma';
import _ from 'lodash';

export const getTodoByTeamID = async (
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

	let todos: any = await prisma.todo.findMany({
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
			dueDate: true,
			status: true,
			isComplete: true,
			issueId: true,
			todoId: true,
			headlineId: true,
			goalId: true,
			kpiId: true,
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
			successor: {
				select: {
					id: true,
					name: true
				}
			},
			predecessor: {
				select: {
					id: true,
					name: true
				}
			},
			headline: {
				select: {
					id: true,
					name: true
				}
			},
			goal: {
				select: {
					id: true,
					name: true
				}
			},
			issues: {
				select: {
					issueId: true,
					issue: true,
					todoId: true,
					todo: true
				}
			},
			kpi: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});
	todos = todos.map((data: any) => {
		if (data.issueId && data.issues.length > 0) {
			let issue = _.find(data.issues, { issueId: data.issueId, todoId: data.id });
			if (issue && issue.issue) {
				data.issue = {
					id: issue.issue.id,
					name: issue.issue.name
				};
			}
		}
		return data;
	});
	return todos;
};

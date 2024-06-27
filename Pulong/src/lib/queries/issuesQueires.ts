import prisma from '$lib/server/prisma';
import _ from 'lodash';

export const getIssuesByTeamID = async (
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

	let issues = await prisma.issue.findMany({
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
			kpi: {
				select: {
					id: true,
					name: true
				}
			},
			todos: {
				select: {
					issueId: true,
					issue: true,
					todoId: true,
					todo: true
				}
			}
		}
	});

	issues = issues.map((data: any) => {
		if (data.todoId && data.todos.length > 0) {
			let todo = _.find(data.todos, { issueId: data.id, todoId: data.todoId });
			if (todo && todo.todo) {
				data.todo = {
					id: todo.todo.id,
					name: todo.todo.name
				};
			}
		}
		return data;
	});
	return issues;
};

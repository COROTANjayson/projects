import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { todoSchema } from '$lib/schema/todo';

export const load: PageServerLoad = async (event) => {
	// let todos;

	// const { locals } = event;
	// if (locals.user && locals.user.id) {
	// 	// const teams = await getTeamsByUserID(locals.user.id);
	// 	// const teamIds = teams.map((team) => team.id);
	// 	// todos = await getTodoByTeamID(teamIds, false);
	// }
	return {
		// todos
	};
};

import type { Actions } from './$types';
import { generateId } from 'lucia';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import { getTodoByTeamID } from '$lib/queries/todoQueires';

// type TodoType = {
// 	id?: string;
// 	name: string;
// 	teamId: string;
// 	notes: string;
// 	ownerId: string;
// 	issueId?: string;
// 	goalId?: string;
// 	headlineId?: string;
// 	todoId?: string;
// 	dueDate: Date;
// 	creatorId: string;
// 	status: string;
// };
export const actions = {
	add: async (event) => {
		const form = await superValidate(event, zod(todoSchema));
		if (!form.valid) {
			return message(form, '');
		}
		const {
			name,
			teamId,
			dueDate,
			notes,
			ownerId,
			issueId,
			todoId,
			headlineId,
			goalId,
			creatorId,
			status,
			kpiId
		} = form.data;
		let id = generateId(30);
		const formatDueDate = new Date(dueDate);

		let data: any = {
			id: id,
			name,
			teamId,
			notes,
			ownerId,
			creatorId,
			dueDate: formatDueDate,
			status
		};
		if (issueId) {
			data.issueId = issueId;
			data.issues = {
				create: [
					{
						issue: {
							connect: {
								id: data.issueId
							}
						}
					}
				]
			};
		}
		if (todoId) data.todoId = todoId;
		if (headlineId) data.headlineId = headlineId;
		if (goalId) data.goalId = goalId;
		if (kpiId) data.kpiId = kpiId;

		const addIssue = await prisma.todo.create({
			data: data
		});
		return {
			success: true,
			add: true,
			addIssue,
			form
		};
	},
	edit: async (event) => {
		const form = await superValidate(event, zod(todoSchema));
		if (!form.valid) {
			return message(form, '');
		}

		const {
			name,
			teamId,
			dueDate,
			notes,
			ownerId,
			issueId,
			todoId,
			headlineId,
			goalId,
			id,
			creatorId
		} = form.data;
		const formatDueDate = new Date(dueDate);

		let data: any = {
			name,
			teamId,
			notes,
			ownerId,
			creatorId,
			dueDate: formatDueDate
		};
		// if (issueId) data.issueId = issueId;
		// if (todoId) data.todoId = todoId;
		// if (headlineId) data.headlineId = headlineId;
		// if (goalId) data.goalId = goalId;

		const updateheadline = await prisma.todo.update({
			where: {
				id: id
			},
			data: data
		});
		return {
			success: true,
			update: true,
			updateheadline,
			form
		};
	},
	delete: async ({ url }) => {
		try {
			const id = url.searchParams.get('id');
			if (id) {
				// await deleteParentWithoutCascading(id);
				await prisma.todo.delete({
					where: {
						id: id
					}
				});
			}
			return { success: true, todo: true };
		} catch (error) {
			console.log(error);
			return { success: false };
		}
	}
} satisfies Actions;

async function deleteParentWithoutCascading(id: string) {
	await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
	await prisma.todo.delete({
		where: { id: id }
	});
	await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
}

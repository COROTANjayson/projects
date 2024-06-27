import type { PageServerLoad } from './$types';
import prisma from '$lib/server/prisma';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { issueSchema } from '$lib/schema/issues';

export const load: PageServerLoad = async (event) => {
	// let issues;

	// const { locals } = event;
	// if (locals.user && locals.user.id) {
	// 	const teams = await getTeamsByUserID(locals.user.id);
	// 	const teamIds = teams.map((team) => team.id);
	// 	issues = await getIssuesByTeamID(teamIds, false);
	// }
	return {
		// issues
	};
};

import type { Actions } from './$types';
import { generateId } from 'lucia';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import { getIssuesByTeamID } from '$lib/queries/issuesQueires';

type IssueType = {
	id?: string;
	name: string;
	teamId: string;
	notes: string;
	ownerId: string;
	issueId?: string;
	goalId?: string;
	headlineId?: string;
	todoId?: string;
	dueDate: Date;
	creatorId: string;
	status: string;
};
export const actions = {
	add: async (event) => {
		const form = await superValidate(event, zod(issueSchema));
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
		if (issueId) data.issueId = issueId;
		if (todoId) {
			data.todoId = todoId;
			data.todos = {
				create: [
					{
						todo: {
							connect: {
								id: data.todoId
							}
						}
					}
				]
			};
		}
		if (headlineId) data.headlineId = headlineId;
		if (goalId) data.goalId = goalId;
		if (kpiId) data.kpiId = kpiId;
		const addIssue = await prisma.issue.create({
			data: {
				...data
			}
		});
		return {
			success: true,
			add: true,
			addIssue,
			form
		};
	},
	edit: async (event) => {
		const form = await superValidate(event, zod(issueSchema));
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

		// let data: IssueType = {
		// 	name,
		// 	teamId,
		// 	notes,
		// 	ownerId,
		// 	creatorId,
		// 	dueDate: formatDueDate,
		// 	status
		// };
		// if (issueId) data.issueId = issueId;
		// if (todoId) data.todoId = todoId;
		// if (headlineId) data.headlineId = headlineId;
		// if (goalId) data.goalId = goalId;

		const updateheadline = await prisma.issue.update({
			where: {
				id: id
			},
			data: {
				name,
				teamId,
				notes,
				ownerId,
				creatorId,
				dueDate: formatDueDate
			}
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
				await prisma.issue.delete({
					where: {
						id: id
					}
				});
			}
			return { success: true, issue: true };
		} catch (error) {
			return { success: false };
		}
	}
} satisfies Actions;

import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import { getTodoByTeamID } from '$lib/queries/todoQueires';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request, params }) => {
	try {
		let todos: any = [];
		if (locals.user && locals.user.id) {
			const url = new URL(request.url);
			const teamId = url.searchParams.get('teamId');
			let teamIds: any = [];
			const isComplete = url.searchParams.get('isComplete');

			if (teamId) {
				teamIds = [teamId];
			} else {
				const teams = await getTeamsByUserID(locals.user.id);
				teamIds = teams.map((team) => team.id);
			}

			if (isComplete === 'true') {
				todos = await getTodoByTeamID(teamIds, true);
			} else if (isComplete === 'false') {
				todos = await getTodoByTeamID(teamIds, false);
			} else {
				todos = await getTodoByTeamID(teamIds);
			}
			return new Response(JSON.stringify({ success: true, data: todos }));
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

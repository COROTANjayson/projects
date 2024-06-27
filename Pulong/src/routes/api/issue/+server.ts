import { getIssuesByTeamID } from '$lib/queries/issuesQueires';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import { getTodoByTeamID } from '$lib/queries/todoQueires';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request, params }) => {
	try {
		let issues: any = [];
		if (locals.user && locals.user.id) {
			const url = new URL(request.url);
			const teamId = url.searchParams.get('teamId');
			const isComplete = url.searchParams.get('isComplete');

			let teamIds: any = [];

			if (teamId) {
				teamIds = [teamId];
			} else {
				const teams = await getTeamsByUserID(locals.user.id);
				teamIds = teams.map((team) => team.id);
			}
			if (isComplete === 'true') {
				issues = await getIssuesByTeamID(teamIds, true);
			} else if (isComplete === 'false') {
				issues = await getIssuesByTeamID(teamIds, false);
			} else {
				issues = await getIssuesByTeamID(teamIds);
			}
			return new Response(JSON.stringify({ success: true, data: issues }));
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

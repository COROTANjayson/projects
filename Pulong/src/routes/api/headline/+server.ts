import { getGoalByTeamID } from '$lib/queries/goalQueires';
import { getHeadlineByTeamID } from '$lib/queries/headlineQueires';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request, params }) => {
	try {
		let headline: any = [];
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
				headline = await getHeadlineByTeamID(teamIds, true);
			} else if (isComplete === 'false') {
				headline = await getHeadlineByTeamID(teamIds, false);
			} else {
				headline = await getHeadlineByTeamID(teamIds);
			}
			return new Response(JSON.stringify({ success: true, data: headline }));
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

import { getGoalByTeamID } from '$lib/queries/goalQueires';
import { getTeamsByUserID } from '$lib/queries/teamsQueries';
import type { RequestHandler } from './$types';

const checkBodyRequest = async (request: any) => {
	try {
		const body = await request.json();
		return body;
	} catch (e) {
		return;
	}
};

export const GET: RequestHandler = async ({ locals, request, params }) => {
	try {
		let kpi: any = [];
		if (locals.user && locals.user.id) {
			const url = new URL(request.url);
			const teamId = url.searchParams.get('teamId');
			let teamIds: any = [];
			if (teamId) {
				teamIds = [teamId];
			} else {
				const teams = await getTeamsByUserID(locals.user.id);
				teamIds = teams.map((team) => team.id);
			}
			kpi = await getGoalByTeamID(teamIds);
			return new Response(JSON.stringify({ success: true, data: kpi }));
		} else {
			return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }));
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false }));
	}
};

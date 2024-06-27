import { getProjectByTeams, getProjects, getTeams } from '$lib/api/project';
import { getUsers } from '$lib/api/user';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const access_token = cookies.get('access_token');
	// console.log(access_token);
	let user_data: any = cookies.get('user_data');
	let user = user_data ? JSON.parse(user_data) : '';
	let teams: any[] = [];
	let allProject: any = [];
	let allUsers: any = [];
	if (access_token) {
		const get_teams = await getTeams(user, access_token);
		teams = get_teams ? get_teams : [];
		let filter = {
			workspace: user.workspace_id
		};
		allProject = await getProjects(filter, access_token);
		allUsers = await getUsers(user, access_token);
	}

	return {
		// projectByTeams: projectByTeams ? projectByTeams : [],
		teams: teams ? teams : [],
		allProject: allProject ? allProject : [],
		allUsers: allUsers ? allUsers : [],
		access_token: access_token,
		user_data: user ? user : []
	};
}) satisfies LayoutServerLoad;

const getAllProjectByTeams = async (teams: any, access_token: string) => {
	let projectByTeams: any = [];

	for (const team of teams) {
		const project = await getProjectByTeams(team.gid, access_token);
		projectByTeams.push(...project);
	}
	return projectByTeams;
};

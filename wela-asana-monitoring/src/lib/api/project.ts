import axios from 'axios';

export const getProjects = async (filters: any, access_token: string) => {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			params: {
				...filters,
				opt_fields: 'team,team.name,permalink_url,name,created_at,owner,members,members.name'
			},
			url: `https://app.asana.com/api/1.0/projects`,
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + access_token
			}
		};
		const response = await axios.request(config);

		let result = response.data;

		return result.data;
	} catch (error) {
		console.log('error', error);
		return [];
	}
};

export const getProjectByTeams = async (teams_id: any, access_token: string) => {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			params: {
				opt_fields: 'team,team.name,name,permalink_url,members,members.name'
			},
			url: `https://app.asana.com/api/1.0/teams/${teams_id}/projects`,
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + access_token
			}
		};
		const response = await axios.request(config);

		let result = response.data;

		return result.data;
	} catch (error) {
		console.log('error', error);
		return [];
	}
};

export const getTeams = async (user: any, access_token: string) => {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			// url: 'https://app.asana.com/api/1.0/users/me/teams',
			url: `https://app.asana.com/api/1.0/workspaces/${user.workspace_id}/teams`,
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + access_token
			}
		};
		const response = await axios.request(config);

		let result = response.data;

		return result.data;
	} catch (error) {
		console.log('error', error);
		return;
	}
};

import axios from 'axios';

export const getUsers = async (user: any, access_token: string) => {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'https://app.asana.com/api/1.0/users',
			params: { workspace: user.workspace_id, opt_fields: 'email,name,photo.image_36x36' },
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

export const getUserByTeam = async (team_id: any, access_token: any) => {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: `https://app.asana.com/api/1.0/teams/${team_id}/team_memberships`,
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

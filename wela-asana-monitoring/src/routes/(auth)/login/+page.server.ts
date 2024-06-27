import axios from 'axios';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, SECRET_REDIRECT_URI } from '$env/static/private';

import type { PageServerLoad } from './$types';
export const load = (async ({ url, cookies, fetch }) => {
	if (cookies.get('access_token')) {
		return { url: '/welcome' };
	}
	let code: string | null = url.searchParams.get('code');
	if (code) {
		try {
			const form = new FormData();
			form.append('grant_type', 'authorization_code');
			form.append('client_id', SECRET_CLIENT_ID);
			form.append('client_secret', SECRET_CLIENT_SECRET);
			form.append('redirect_uri', SECRET_REDIRECT_URI);
			form.append('code', code ?? '');

			let axios_res: any = await axios(`https://app.asana.com/-/oauth_token`, {
				method: 'post',
				data: form
			});

			axios_res = axios_res.data;
			let asana_user = await getUser(axios_res);
			axios_res.data.workspace_id = asana_user.workspace_id;

			if (axios_res) {
				cookies.set('access_token', axios_res.access_token, {
					path: '/',
					maxAge: axios_res.expires_in
				});
				cookies.set('refresh_token', axios_res.refresh_token, {
					path: '/',
					maxAge: axios_res.expires_in
				});

				cookies.set('user_data', JSON.stringify(axios_res.data), {
					path: '/',
					maxAge: axios_res.expires_in
				});
			}

			return { url: '/welcome' };
		} catch (e) {
			return { url: '/login' };
		}
	}

	return { url: '' };
}) satisfies PageServerLoad;

const getUser = async (res: any) => {
	const { data, access_token } = res;

	let response = await axios(`https://app.asana.com/api/1.0/users/${data.gid}`, {
		method: 'get',
		maxBodyLength: Infinity,
		headers: {
			accept: 'application/json',
			authorization: 'Bearer ' + access_token
		}
	});

	let result = response.data;

	let workspaces = result.data.workspaces;
	let workspace_id = '';

	if (workspaces) {
		let wela_workspace = workspaces.find((i: { name: string }) => i.name === 'wela.online');
		workspace_id = wela_workspace.gid ? wela_workspace.gid : '';
	}
	if (result.data) {
		result.data = {
			...result.data,
			workspace_id: workspace_id
		};
	}

	return result.data;
};

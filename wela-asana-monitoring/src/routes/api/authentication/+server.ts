import type { RequestHandler } from './$types';
import axios from 'axios';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, SECRET_REDIRECT_URI } from '$env/static/private';

export const GET: RequestHandler = async ({ request, fetch, cookies }) => {
	try {
		const code = request.headers.get('code');

		const form = new FormData();
		form.append('grant_type', 'authorization_code');
		form.append('client_id', SECRET_CLIENT_ID);
		form.append('client_secret', SECRET_CLIENT_SECRET);
		form.append('redirect_uri', SECRET_REDIRECT_URI);
		form.append('code', code ?? '');

		let response = await axios(`https://app.asana.com/-/oauth_token`, {
			method: 'post',
			data: form
		});

		// const response: any = await fetch(`https://app.asana.com/-/oauth_token`, {
		// 	method: 'POST',
		// 	body: form
		// });

		let result = response.data;
		// const asana_user = await getUser(result);
		// console.log('asana_user', asana_user);
		if (result) {
			cookies.set('access_token', result.access_token, {
				path: '/',
				maxAge: result.expires_in
			});
			cookies.set('refresh_token', result.refresh_token, {
				path: '/',
				maxAge: result.expires_in
			});
			// cookies.set('user_data', JSON.stringify(result.data), {
			// 	path: '/',
			// 	maxAge: result.expires_in
			// });
		}

		return new Response(JSON.stringify({ success: true }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: false }));
	}
};

const getUser = async (res: any) => {
	const { data, access_token } = res;
	// let config = {
	// 	method: 'get',
	// 	maxBodyLength: Infinity,
	// 	url: `https://app.asana.com/api/1.0/users/${data.gid}`,
	// 	headers: {
	// 		accept: 'application/json',
	// 		authorization: 'Bearer ' + access_token
	// 	}
	// };
	// const response:any = await fetch(`https://app.asana.com/api/1.0/users/${data.gid}`, {
	// 	method: 'GET',
	// 	headers: {
	// 		Accept: 'application/json',
	// 		Authorization: 'Bearer ' + access_token
	// 	}
	// });
	let response = await axios(`https://app.asana.com/api/1.0/users/${data.gid}`, {
		method: 'get',
		maxBodyLength: Infinity,
		headers: {
			accept: 'application/json',
			authorization: 'Bearer ' + access_token
		}
	});

	let result = response.data;
	return result;
};
